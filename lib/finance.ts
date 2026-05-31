import { supabase } from "@/lib/supabase";
import type { ServiceAccountCost, Subscription } from "@/types/database";

export type FinancialOverviewResult = {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  selectedMonthLabel?: string;
};

export type MonthlyTrendItem = {
  month: string; // YYYY-MM
  label: string; // E.g. "Mei 26"
  revenue: number;
  expense: number;
  profit: number;
};

export type UnitEconomicItem = {
  accountId: string;
  accountLabel: string;
  serviceName: string;
  revenue: number;
  expense: number;
  profit: number;
  margin: number;
  activeBookingsCount: number;
};

export type LedgerTransaction = {
  id: string;
  type: "income" | "expense";
  date: string;
  amount: number;
  label: string;
  description: string;
  status: string;
};

function toMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
}

export async function getFinancialOverview(selectedMonth?: string): Promise<FinancialOverviewResult> {
  const [incomesResult, expensesResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("price_snapshot,start_date")
      .in("status", ["booked", "completed"]),
    supabase
      .from("service_account_costs")
      .select("amount,cost_date")
      .neq("status", "cancelled"),
  ]);

  let incomes = incomesResult.data ?? [];
  let expenses = expensesResult.data ?? [];

  if (selectedMonth) {
    incomes = incomes.filter((inc) => inc.start_date.startsWith(selectedMonth));
    expenses = expenses.filter((exp) => exp.cost_date.startsWith(selectedMonth));
  }

  const totalRevenue = incomes.reduce((sum, item) => sum + (item.price_snapshot || 0), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  let selectedMonthLabel: string | undefined;
  if (selectedMonth) {
    selectedMonthLabel = toMonthLabel(selectedMonth);
  }

  return {
    totalRevenue,
    totalExpense,
    netProfit,
    profitMargin,
    selectedMonthLabel,
  };
}

export async function getFinancialTrends(): Promise<MonthlyTrendItem[]> {
  const [incomesResult, expensesResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("price_snapshot,start_date")
      .in("status", ["booked", "completed"]),
    supabase
      .from("service_account_costs")
      .select("amount,cost_date")
      .neq("status", "cancelled"),
  ]);

  const monthlyData: Record<string, { revenue: number; expense: number }> = {};

  // Group incomes
  (incomesResult.data ?? []).forEach((item) => {
    const monthKey = item.start_date.slice(0, 7); // YYYY-MM
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, expense: 0 };
    }
    monthlyData[monthKey].revenue += item.price_snapshot || 0;
  });

  // Group expenses
  (expensesResult.data ?? []).forEach((item) => {
    const monthKey = item.cost_date.slice(0, 7); // YYYY-MM
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, expense: 0 };
    }
    monthlyData[monthKey].expense += item.amount || 0;
  });

  // Convert to sorted list and limit to last 6 months
  const trendItems = Object.entries(monthlyData)
    .map(([monthKey, val]) => ({
      month: monthKey,
      label: toMonthLabel(monthKey),
      revenue: val.revenue,
      expense: val.expense,
      profit: val.revenue - val.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  return trendItems;
}

export async function getUnitEconomics(): Promise<UnitEconomicItem[]> {
  const [accountsResult, incomesResult, expensesResult] = await Promise.all([
    supabase
      .from("service_accounts")
      .select("id,label,service_name")
      .neq("status", "archived"),
    supabase
      .from("subscriptions")
      .select("price_snapshot,service_account_id,status")
      .in("status", ["booked", "completed"]),
    supabase
      .from("service_account_costs")
      .select("amount,service_account_id")
      .neq("status", "cancelled"),
  ]);

  const accounts = accountsResult.data ?? [];
  const incomes = incomesResult.data ?? [];
  const expenses = expensesResult.data ?? [];

  return accounts.map((acc) => {
    const accountIncomes = incomes.filter((item) => item.service_account_id === acc.id);
    const accountExpenses = expenses.filter((item) => item.service_account_id === acc.id);

    const revenue = accountIncomes.reduce((sum, item) => sum + (item.price_snapshot || 0), 0);
    const expense = accountExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const profit = revenue - expense;
    const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
    const activeBookingsCount = accountIncomes.filter((item) => item.status === "booked").length;

    return {
      accountId: acc.id,
      accountLabel: acc.label,
      serviceName: acc.service_name,
      revenue,
      expense,
      profit,
      margin,
      activeBookingsCount,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export async function getCombinedLedger(): Promise<LedgerTransaction[]> {
  const [incomesResult, expensesResult] = await Promise.all([
    supabase
      .from("subscriptions")
      .select(`
        id,price_snapshot,start_date,status,notes,
        customers(name),
        service_accounts(label)
      `)
      .in("status", ["booked", "completed"]),
    supabase
      .from("service_account_costs")
      .select(`
        id,amount,cost_date,status,notes,
        service_accounts(label)
      `)
      .neq("status", "cancelled"),
  ]);

  type SubscriptionRow = Subscription & {
    customers: { name: string } | null;
    service_accounts: { label: string } | null;
  };

  type CostRow = ServiceAccountCost & {
    service_accounts: { label: string } | null;
  };

  const incomeRows = (incomesResult.data ?? []) as unknown as SubscriptionRow[];
  const expenseRows = (expensesResult.data ?? []) as unknown as CostRow[];

  const ledger: LedgerTransaction[] = [
    ...incomeRows.map((inc) => ({
      id: inc.id,
      type: "income" as const,
      date: inc.start_date,
      amount: inc.price_snapshot,
      label: inc.customers?.name ?? "Unknown Customer",
      description: `Rent slot on account: ${inc.service_accounts?.label ?? "Unknown"}`,
      status: inc.status,
    })),
    ...expenseRows.map((exp) => ({
      id: exp.id,
      type: "expense" as const,
      date: exp.cost_date,
      amount: exp.amount,
      label: `Expense: ${exp.service_accounts?.label ?? "Unknown"}`,
      description: exp.notes || "Supplier purchase cost",
      status: exp.status,
    })),
  ];

  return ledger.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAvailableMonths(): Promise<{ value: string; label: string }[]> {
  const [incomesResult, expensesResult] = await Promise.all([
    supabase.from("subscriptions").select("start_date").neq("status", "archived"),
    supabase.from("service_account_costs").select("cost_date").neq("status", "cancelled"),
  ]);

  const months = new Set<string>();

  (incomesResult.data ?? []).forEach((item) => {
    if (item.start_date) months.add(item.start_date.slice(0, 7));
  });

  (expensesResult.data ?? []).forEach((item) => {
    if (item.cost_date) months.add(item.cost_date.slice(0, 7));
  });

  return Array.from(months)
    .sort((a, b) => b.localeCompare(a))
    .map((monthKey) => ({
      value: monthKey,
      label: toMonthLabel(monthKey),
    }));
}

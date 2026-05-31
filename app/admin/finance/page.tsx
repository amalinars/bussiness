import { connection } from "next/server";
import { ArrowDownLeft, ArrowUpRight, DollarSign, Percent, X } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCombinedLedger, getFinancialOverview, getFinancialTrends, getUnitEconomics, getAvailableMonths } from "@/lib/finance";
import { supabase } from "@/lib/supabase";

import { FinanceChart } from "@/components/FinanceChart";

import { cancelExpenseAction } from "./actions";
import { ExpenseFormDialog } from "./ExpenseFormDialog";
import { FinanceMonthFilter } from "./FinanceMonthFilter";

export const revalidate = 0;

type FinancePageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

export default async function FinancePage({ searchParams }: FinancePageProps) {
  await connection();
  const { month } = await searchParams;
  const selectedMonth = month || "";

  // Load all aggregates & data parallelly
  const [
    overview,
    trends,
    unitEconomics,
    ledger,
    availableMonths,
    accountsResult,
  ] = await Promise.all([
    getFinancialOverview(selectedMonth),
    getFinancialTrends(),
    getUnitEconomics(),
    getCombinedLedger(),
    getAvailableMonths(),
    supabase
      .from("service_accounts")
      .select("id,label,service_name")
      .neq("status", "archived")
      .order("label", { ascending: true }),
  ]);

  const accounts = accountsResult.data ?? [];

  // Filter ledger list based on month selection if any
  const filteredLedger = selectedMonth
    ? ledger.filter((tx) => tx.date.startsWith(selectedMonth))
    : ledger;

  const financialMetrics = [
    {
      title: "Total Revenue",
      value: `Rp ${overview.totalRevenue.toLocaleString("id-ID")}`,
      helper: selectedMonth ? `Income for ${overview.selectedMonthLabel}` : "All-time accumulated income",
      icon: ArrowUpRight,
      tone: "green" as const,
    },
    {
      title: "Total Expenses",
      value: `Rp ${overview.totalExpense.toLocaleString("id-ID")}`,
      helper: selectedMonth ? `Supplier cost for ${overview.selectedMonthLabel}` : "All-time supplier costs",
      icon: ArrowDownLeft,
      tone: "pink" as const,
    },
    {
      title: "Net Profit",
      value: `Rp ${overview.netProfit.toLocaleString("id-ID")}`,
      helper: selectedMonth ? `Net gain for ${overview.selectedMonthLabel}` : "Accumulated net profit",
      icon: DollarSign,
      tone: overview.netProfit >= 0 ? ("green" as const) : ("pink" as const),
    },
    {
      title: "Profit Margin",
      value: `${overview.profitMargin}%`,
      helper: "Profit efficiency margin",
      icon: Percent,
      tone: overview.profitMargin >= 30 ? ("green" as const) : ("yellow" as const),
    },
  ];

  return (
    <PageContainer
      title="Financials"
      eyebrow="Cash Flow & Performance"
      description="Manage cash flow, track platform supplier expenses, and review unit economics per account."
    >
      {/* Month Filter Selector and Expense Action Form */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow">
        <FinanceMonthFilter selectedMonth={selectedMonth} availableMonths={availableMonths} />

        <ExpenseFormDialog accounts={accounts} />
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financialMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Neobrutalism Financial Trend Chart */}
      <Card className="bg-secondary-background">
        <CardHeader>
          <CardTitle className="text-xl font-heading font-black">Monthly Cash Flow Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          {trends.length > 0 ? (
            <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
              <FinanceChart data={trends} />
            </div>
          ) : (
            <div className="rounded-base border-2 border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground font-base">No cash flow trend data available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Columns: Left Ledger, Right Unit Economics */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">

        {/* Ledgers Transaction List */}
        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">Combined Transaction Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLedger.length > 0 ? (
              <div className="space-y-3">
                {filteredLedger.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-base border-2 border-border bg-background p-4 shadow-shadow"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge tone={tx.type === "income" ? "active" : "warning"}>
                          {tx.type === "income" ? "+" : "-"} {tx.type.toUpperCase()}
                        </StatusBadge>
                        <p className="font-heading font-bold">{tx.label}</p>
                      </div>
                      <p className="text-sm font-base text-muted-foreground">{tx.description}</p>
                      <p className="text-xs font-base text-muted-foreground/80">Date: {tx.date}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-heading font-bold text-lg ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "income" ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
                        </p>
                        <StatusBadge tone={tx.status === "cancelled" ? "neutral" : tx.status === "paid" || tx.status === "completed" ? "active" : "warning"}>
                          {tx.status}
                        </StatusBadge>
                      </div>
                      {tx.type === "expense" && tx.status !== "cancelled" && (
                        <form action={cancelExpenseAction}>
                          <input type="hidden" name="id" value={tx.id} />
                          <button
                            type="submit"
                            title="Cancel expense"
                            className="inline-flex size-8 items-center justify-center rounded-base border-2 border-border bg-rose-300 text-black shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                          >
                            <X className="size-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-base border-2 border-dashed border-border p-8 text-center bg-background">
                <p className="text-muted-foreground font-base">No transaction ledger records found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unit Economics table per Service Account */}
        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">Service Account Unit Economics</CardTitle>
          </CardHeader>
          <CardContent>
            {unitEconomics.length > 0 ? (
              <div className="space-y-4">
                {unitEconomics.map((ec) => (
                  <div
                    key={ec.accountId}
                    className="rounded-base border-2 border-border bg-background p-4 shadow-shadow space-y-3"
                  >
                    <div>
                      <p className="font-heading font-bold text-lg">{ec.accountLabel}</p>
                      <p className="text-sm font-base text-muted-foreground">{ec.serviceName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm font-base bg-secondary-background p-2.5 rounded-base border border-border">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Revenue:</p>
                        <p className="font-bold text-green-600">Rp {ec.revenue.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">Expense (Costs):</p>
                        <p className="font-bold text-red-600">Rp {ec.expense.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="space-y-1 border-t border-border/50 pt-2 col-span-2 flex justify-between items-center">
                        <span>Net Profit:</span>
                        <span className={`font-bold ${ec.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          Rp {ec.profit.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="border-t border-border/50 pt-2 col-span-2 flex justify-between items-center">
                        <span>Margin:</span>
                        <span className={`font-bold ${ec.margin >= 30 ? "text-green-600" : ec.margin > 0 ? "text-yellow-600" : "text-red-600"}`}>
                          {ec.margin}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-base border-2 border-dashed border-border p-8 text-center bg-background">
                <p className="text-muted-foreground font-base">No account financials found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

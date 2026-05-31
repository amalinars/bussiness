import { connection } from "next/server";
import { ArrowDownLeft, ArrowUpRight, DollarSign, Percent, X } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { PendingSubmitButton } from "@/components/PendingSubmitButton";
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
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow sm:flex-row sm:items-center">
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
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg font-heading font-black sm:text-xl">Monthly Cash Flow Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {trends.length > 0 ? (
            <div className="rounded-base border-2 border-border bg-background p-2 shadow-shadow sm:p-4">
              <FinanceChart data={trends} />
            </div>
          ) : (
            <div className="rounded-base border-2 border-dashed border-border p-4 text-center sm:p-8">
              <p className="text-muted-foreground font-base">No cash flow trend data available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Columns: Left Ledger, Right Unit Economics */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">

        {/* Ledgers Transaction List */}
        <Card className="bg-secondary-background">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg font-heading font-black sm:text-xl">Combined Transaction Ledger</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {filteredLedger.length > 0 ? (
              <div className="space-y-3">
                {filteredLedger.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col items-stretch justify-between gap-3 rounded-base border-2 border-border bg-background p-3 shadow-shadow sm:flex-row sm:items-center sm:p-4"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone={tx.type === "income" ? "active" : "warning"}>
                          {tx.type === "income" ? "+" : "-"} {tx.type.toUpperCase()}
                        </StatusBadge>
                        <p className="min-w-0 wrap-break-word font-heading font-bold">{tx.label}</p>
                      </div>
                      <p className="wrap-break-word text-sm font-base text-muted-foreground">{tx.description}</p>
                      <p className="wrap-break-word text-xs font-base text-muted-foreground/80">Date: {tx.date}</p>
                    </div>

                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
                      <div className="text-left sm:text-right">
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
                          <PendingSubmitButton
                            idleLabel="Cancel"
                            pendingLabel="Cancelling..."
                            title="Cancel expense"
                            size="icon"
                            className="size-8 bg-rose-300 text-black"
                          >
                            <X className="size-4" />
                          </PendingSubmitButton>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-base border-2 border-dashed border-border bg-background p-4 text-center sm:p-8">
                <p className="text-muted-foreground font-base">No transaction ledger records found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unit Economics table per Service Account */}
        <Card className="bg-secondary-background">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg font-heading font-black sm:text-xl">Service Account Unit Economics</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {unitEconomics.length > 0 ? (
              <div className="space-y-4">
                {unitEconomics.map((ec) => (
                  <div
                    key={ec.accountId}
                    className="space-y-3 rounded-base border-2 border-border bg-background p-3 shadow-shadow sm:p-4"
                  >
                    <div className="min-w-0">
                      <p className="wrap-break-word font-heading text-lg font-bold">{ec.accountLabel}</p>
                      <p className="wrap-break-word text-sm font-base text-muted-foreground">{ec.serviceName}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 rounded-base border border-border bg-secondary-background p-2.5 text-sm font-base sm:grid-cols-2">
                      <div className="min-w-0 space-y-1">
                        <p className="text-xs text-muted-foreground">Revenue:</p>
                        <p className="wrap-break-word font-bold text-green-600">Rp {ec.revenue.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-xs text-muted-foreground">Expense (Costs):</p>
                        <p className="wrap-break-word font-bold text-red-600">Rp {ec.expense.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="col-span-1 flex items-center justify-between gap-3 border-t border-border/50 pt-2 sm:col-span-2">
                        <span>Net Profit:</span>
                        <span className={`wrap-break-word text-right font-bold ${ec.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          Rp {ec.profit.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-between gap-3 border-t border-border/50 pt-2 sm:col-span-2">
                        <span>Margin:</span>
                        <span className={`text-right font-bold ${ec.margin >= 30 ? "text-green-600" : ec.margin > 0 ? "text-yellow-600" : "text-red-600"}`}>
                          {ec.margin}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-base border-2 border-dashed border-border bg-background p-4 text-center sm:p-8">
                <p className="text-muted-foreground font-base">No account financials found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

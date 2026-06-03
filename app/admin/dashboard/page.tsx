import { connection } from "next/server";
import { CalendarClock, CheckCircle2, LayoutGrid, Server, UsersRound, WalletCards } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { PeriodFilterLinks } from "@/components/PeriodFilterLinks";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard";
import { normalizePeriodFilter } from "@/lib/date-ranges";
import { Countdown } from "@/components/Countdown";
import { ServiceAccountProfileFormDialog } from "../accounts/[id]/ServiceAccountProfileFormDialog";

export const revalidate = 0;

type DashboardPageProps = {
  searchParams: Promise<{
    period?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await connection();
  const { period } = await searchParams;
  const selectedPeriod = normalizePeriodFilter(period);
  const data = await getDashboardData(selectedPeriod);
  const periodLabel = selectedPeriod === "all" ? "All-time" : selectedPeriod === "day" ? "Today" : selectedPeriod === "week" ? "This week" : "This month";

  const businessMetrics = [
    {
      title: "Total Customers",
      value: data.customerCount.toString(),
      helper: "Active & inactive customers",
      icon: UsersRound,
      tone: "green" as const,
    },
    {
      title: "Active Accounts",
      value: data.activeAccountsCount.toString(),
      helper: "Service accounts active or full",
      icon: Server,
      tone: "blue" as const,
    },
    {
      title: "Available Slots",
      value: data.availableSlots.toString(),
      helper: "Unused/free customer slots",
      icon: LayoutGrid,
      tone: "pink" as const,
    },
    {
      title: "Attention Required",
      value: data.maintenanceAccountsCount.toString(),
      helper: "Accounts in maintenance/inactive",
      icon: WalletCards,
      tone: "yellow" as const,
    },
  ];

  const bookingMetrics = [
    {
      title: "Active Bookings",
      value: data.activeBookingsCount.toString(),
      helper: "Currently booked rental rows",
      icon: CalendarClock,
      tone: "blue" as const,
    },
    {
      title: "Booking Value",
      value: `Rp ${data.bookingValue.toLocaleString("id-ID")}`,
      helper: `${periodLabel} booking value`,
      icon: WalletCards,
      tone: "pink" as const,
    },
    {
      title: "Total Spent",
      value: `Rp ${data.totalSpent.toLocaleString("id-ID")}`,
      helper: `${periodLabel} supplier costs`,
      icon: WalletCards,
      tone: "yellow" as const,
    },
    {
      title: "Gross Profit",
      value: `Rp ${data.grossProfit.toLocaleString("id-ID")}`,
      helper: `${periodLabel} booking value - spent`,
      icon: CheckCircle2,
      tone: data.grossProfit >= 0 ? ("green" as const) : ("pink" as const),
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      eyebrow="Overview"
      description="Key metrics, upcoming renewals, and recent activity."
    >
      <div className="flex flex-col gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading font-bold">Period Filter</p>
          <p className="text-sm text-muted-foreground">Showing {periodLabel.toLowerCase()} financial totals.</p>
        </div>
        <PeriodFilterLinks selectedPeriod={selectedPeriod} basePath="/admin/dashboard" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {businessMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {bookingMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">
              Bookings by Service Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.bookingByServiceAccount.length > 0 ? (
              <div className="space-y-4">
                {data.bookingByServiceAccount.map((account) => (
                  <div key={account.id} className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-heading font-bold">{account.label}</p>
                        <p className="text-sm text-muted-foreground">{account.serviceName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold">Rp {account.bookingValue.toLocaleString("id-ID")}</p>
                        <p className="text-xs text-muted-foreground">Monthly value: Rp {account.monthlyBookingValue.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <StatusBadge tone="info">{account.totalBookings} total</StatusBadge>
                      <StatusBadge tone="active">{account.activeBookings} active</StatusBadge>
                      <StatusBadge tone="neutral">{account.completedBookings} completed</StatusBadge>
                    </div>
                    <div className="rounded-base border border-border bg-secondary-background p-2 text-xs font-base space-y-1">
                      <div className="flex justify-between">
                        <span>Spent (all-time):</span>
                        <span className="font-bold">Rp {account.spent.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-1">
                        <span>Gross profit:</span>
                        <span className={`font-bold ${account.grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          Rp {account.grossProfit.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-base border-2 border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground font-base">No booking summary found.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">
              Ending Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.endingSoonBookings.length > 0 ? (
              <div className="space-y-4">
                {data.endingSoonBookings.map((booking) => (
                  <div key={booking.id} className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-heading font-bold">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.accountLabel} — {booking.profileName}
                          {booking.profilePin ? ` — PIN ${booking.profilePin}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Countdown endDate={booking.endDate} endTime={booking.endTime} status={booking.status} />
                        <StatusBadge tone="warning">{booking.endDateLabel}</StatusBadge>
                      </div>
                    </div>
                    <p className="text-sm font-base">{booking.packageName} ends on {booking.endDate}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-base border-2 border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground font-base">No active bookings ending in the next 3 days.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary-background">
        <CardHeader>
          <CardTitle className="text-xl font-heading font-black">
            Available Profiles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.availableProfiles.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {data.availableProfiles.map((profile) => (
                <div key={profile.id} className="min-w-0 space-y-3 rounded-base border-2 border-border bg-background p-4 shadow-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="wrap-break-word font-heading font-bold">{profile.profile_name}</p>
                      <p className="wrap-break-word text-sm text-muted-foreground">{profile.accountLabel} — {profile.serviceName}</p>
                    </div>
                    <StatusBadge tone="active">{profile.status}</StatusBadge>
                  </div>
                  <div className="grid gap-2 text-sm font-base">
                    <div className="rounded-base border border-border bg-secondary-background p-2">
                      <p className="text-xs text-muted-foreground">PIN</p>
                      <p>{profile.profile_pin ?? "-"}</p>
                    </div>
                    {profile.notes ? (
                      <div className="rounded-base border border-border bg-secondary-background p-2">
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="whitespace-pre-wrap wrap-break-word">{profile.notes}</p>
                      </div>
                    ) : null}
                  </div>
                  <ServiceAccountProfileFormDialog serviceAccountId={profile.service_account_id} profile={profile} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-base border-2 border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground font-base">No available rentable profiles found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-center justify-between rounded-base border-2 border-border bg-background p-4 shadow-shadow"
                  >
                    <div>
                      <p className="font-heading font-bold">{activity.label}</p>
                      <p className="text-sm text-muted-foreground">
                        New {activity.type} added ({activity.status})
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        tone={activity.type === "Customer" ? "active" : "info"}
                      >
                        {activity.type}
                      </StatusBadge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-base border-2 border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground font-base">
                  No recent activity found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
              <div className="mb-2 flex flex-wrap gap-2">
                <StatusBadge tone="active">Operational</StatusBadge>
                <StatusBadge tone="info">Live Data</StatusBadge>
              </div>
              <p className="font-base text-sm">
                Business records are up to date and ready for daily operations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

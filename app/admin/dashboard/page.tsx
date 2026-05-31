import { connection } from "next/server";
import { CalendarClock, CheckCircle2, LayoutGrid, Server, UsersRound, WalletCards } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard";

export const revalidate = 0;

export default async function DashboardPage() {
  await connection();
  const data = await getDashboardData();

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
      title: "Completed Bookings",
      value: data.completedBookingsCount.toString(),
      helper: "Finished rentals from bookings",
      icon: CheckCircle2,
      tone: "green" as const,
    },
    {
      title: "Booking Value",
      value: `Rp ${data.bookingValue.toLocaleString("id-ID")}`,
      helper: "From booking price snapshots, not payment table",
      icon: WalletCards,
      tone: "pink" as const,
    },
    {
      title: "Ending Soon",
      value: data.endingSoonCount.toString(),
      helper: "Booked rows ending within 3 days",
      icon: CalendarClock,
      tone: "yellow" as const,
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      eyebrow="Overview"
      description="Real-time metrics and activity feed from your business database."
    >
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
                      <p className="font-heading font-bold">Rp {account.bookingValue.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone="info">{account.totalBookings} total</StatusBadge>
                      <StatusBadge tone="active">{account.activeBookings} active</StatusBadge>
                      <StatusBadge tone="neutral">{account.completedBookings} completed</StatusBadge>
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
                      <StatusBadge tone="warning">{booking.endDateLabel}</StatusBadge>
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
                <StatusBadge tone="info">Supabase Live</StatusBadge>
              </div>
              <p className="font-base text-sm">
                Database connection established. All modules are reporting live data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

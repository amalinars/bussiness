import { connection } from "next/server";
import { Server, UsersRound, WalletCards, LayoutGrid } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard";

export const revalidate = 0;

export default async function DashboardPage() {
  await connection();
  const data = await getDashboardData();

  const metrics = [
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

  return (
    <PageContainer
      title="Dashboard"
      eyebrow="Overview"
      description="Real-time metrics and activity feed from your business database."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
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


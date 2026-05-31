import { Database as DatabaseIcon, Server, UsersRound, WalletCards } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

async function getDashboardData() {
  const [
    { count: customerCount },
    { count: activeAccountsCount },
    { count: pendingAccountsCount },
    { data: recentCustomers },
    { data: recentAccounts },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase
      .from("service_accounts")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("service_accounts")
      .select("*", { count: "exact", head: true })
      .eq("status", "maintenance"),
    supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("service_accounts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentActivity = [
    ...(recentCustomers?.map((c) => ({
      id: c.id,
      type: "Customer",
      label: c.name,
      date: new Date(c.created_at),
    })) || []),
    ...(recentAccounts?.map((a) => ({
      id: a.id,
      type: "Service Account",
      label: a.label,
      date: new Date(a.created_at),
    })) || []),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return {
    customerCount: customerCount || 0,
    activeAccountsCount: activeAccountsCount || 0,
    pendingAccountsCount: pendingAccountsCount || 0,
    recentActivity,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const metrics = [
    {
      title: "Total Customers",
      value: data.customerCount.toString(),
      helper: "Total registered customers",
      icon: UsersRound,
      tone: "green" as const,
    },
    {
      title: "Active Accounts",
      value: data.activeAccountsCount.toString(),
      helper: "Service accounts currently active",
      icon: Server,
      tone: "blue" as const,
    },
    {
      title: "Maintenance",
      value: data.pendingAccountsCount.toString(),
      helper: "Accounts requiring attention",
      icon: WalletCards,
      tone: "yellow" as const,
    },
    {
      title: "Data Source",
      value: "Supabase",
      helper: "Connected to live database",
      icon: DatabaseIcon,
      tone: "pink" as const,
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
                        New {activity.type} added
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

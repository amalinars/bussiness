import { Database, Server, UsersRound, WalletCards } from "lucide-react";

import { MetricCard } from "@/components/MetricCard";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    title: "Customer Records",
    value: "0",
    helper: "Ready for customer data setup",
    icon: UsersRound,
    tone: "green" as const,
  },
  {
    title: "Service Accounts",
    value: "0",
    helper: "Inventory module prepared",
    icon: Server,
    tone: "yellow" as const,
  },
  {
    title: "Available Slots",
    value: "0",
    helper: "Slot tracking planned for this module",
    icon: WalletCards,
    tone: "pink" as const,
  },
  {
    title: "Data Source",
    value: "Local UI",
    helper: "No Supabase schema connected yet",
    icon: Database,
    tone: "blue" as const,
  },
];

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      eyebrow="Active MVP module"
      description="Operational shell for customer and service account management. Metrics are placeholders until database work starts."
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
              Current Work Area
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-base border-2 border-border bg-background p-4 shadow-shadow">
              <div className="mb-2 flex flex-wrap gap-2">
                <StatusBadge tone="active">Dashboard</StatusBadge>
                <StatusBadge tone="warning">Customers</StatusBadge>
                <StatusBadge tone="info">Service Accounts</StatusBadge>
              </div>
              <p className="font-base">
                The app shell is limited to the first three MVP modules. Database schema,
                CRUD, authentication, and integrations are intentionally not connected yet.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">
              Next Setup Step
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-base">
              After this shell is stable, the next project step is database planning for
              customers and service accounts.
            </p>
            <Button variant="neutral" disabled>
              CRUD not enabled yet
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary-background">
        <CardHeader>
          <CardTitle className="text-xl font-heading font-black">
            Scope Guardrails
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <StatusBadge>Authentication: later</StatusBadge>
          <StatusBadge>Supabase schema: later</StatusBadge>
          <StatusBadge>Integrations: later</StatusBadge>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

import { Activity, BellRing, CreditCard, UsersRound } from "lucide-react";

import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { title: "Active Customers", value: "128", helper: "Dummy customer count", icon: UsersRound },
  { title: "Active Subscriptions", value: "214", helper: "Across all platforms", icon: Activity },
  { title: "Expiring Soon", value: "17", helper: "Due within 7 days", icon: BellRing },
  { title: "Unpaid Payments", value: "9", helper: "Pending reconciliation", icon: CreditCard },
];

export default function DashboardPage() {
  return (
    <PageContainer
      title="Dashboard"
      description="Operational snapshot for the internal subscription sharing business."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.title}>
              <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{metric.value}</div>
                <p className="mt-1 text-sm text-muted-foreground">{metric.helper}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}

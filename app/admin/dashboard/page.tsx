import { Activity, BellRing, CreditCard, UsersRound } from "lucide-react";

import { PageContainer } from "@/components/PageContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
            <Card key={metric.title} className="bg-secondary-background">
              <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle className="text-sm font-base">
                  {metric.title}
                </CardTitle>
                <div className="rounded-base border-2 border-border bg-main p-2 text-main-foreground shadow-shadow">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-black tracking-tight">{metric.value}</div>
                <p className="mt-1 text-sm font-base">{metric.helper}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-secondary-background">
        <CardHeader>
          <CardTitle className="text-xl font-heading font-black">
            Neobrutalism component preview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pipeline">
              <AccordionTrigger>Daily operations checklist</AccordionTrigger>
              <AccordionContent>
                Review unpaid invoices, confirm expiring shared accounts, and update
                customer renewal notes before reminders are sent.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button size="lg">Open dashboard actions</Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

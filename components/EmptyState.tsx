import { Inbox } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed bg-secondary-background">
      <CardHeader className="items-center text-center">
        <div className="mb-2 rounded-base border-2 border-border bg-main p-3 text-main-foreground shadow-shadow">
          <Inbox className="size-6" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-sm font-base">
          This placeholder keeps the dashboard structure ready while business logic is added later.
        </p>
      </CardContent>
    </Card>
  );
}

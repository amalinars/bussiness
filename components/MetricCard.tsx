import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "yellow" | "pink";
};

const toneClasses = {
  blue: "bg-[#d8e7ff]",
  green: "bg-[#dff4e8]",
  yellow: "bg-main",
  pink: "bg-[#f3ddec]",
};

export function MetricCard({
  title,
  value,
  helper,
  icon: Icon,
  tone = "blue",
}: MetricCardProps) {
  return (
    <Card className="bg-secondary-background">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle className="text-sm font-base">{title}</CardTitle>
        <div
          className={cn(
            "rounded-base border-2 border-border p-2 text-main-foreground shadow-shadow",
            toneClasses[tone],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-heading font-black tracking-tight">{value}</div>
        <p className="mt-1 text-sm font-base">{helper}</p>
      </CardContent>
    </Card>
  );
}

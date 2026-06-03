import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PeriodFilter } from "@/lib/date-ranges";

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "all", label: "All" },
];

type PeriodFilterLinksProps = {
  selectedPeriod: PeriodFilter;
  basePath: string;
};

export function PeriodFilterLinks({ selectedPeriod, basePath }: PeriodFilterLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PERIOD_OPTIONS.map((option) => {
        const isActive = selectedPeriod === option.value;
        const href = option.value === "all" ? basePath : `${basePath}?period=${option.value}`;

        return (
          <Button key={option.value} asChild size="sm" variant={isActive ? "default" : "neutral"}>
            <Link href={href}>{option.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}

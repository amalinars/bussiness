"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { LoadingDots } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";

type FinanceMonthFilterProps = {
  selectedMonth: string;
  availableMonths: { value: string; label: string }[];
};

export function FinanceMonthFilter({ selectedMonth, availableMonths }: FinanceMonthFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleMonthChange(month: string) {
    startTransition(() => {
      router.push(month ? `/admin/finance?month=${encodeURIComponent(month)}` : "/admin/finance");
    });
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
      <label className="flex w-full flex-col gap-1 text-sm font-heading sm:w-auto sm:flex-row sm:items-center">
        Filter by Month:
        <select
          name="month"
          value={selectedMonth}
          className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border sm:ml-2 sm:w-auto sm:py-1.5"
          disabled={isPending}
          onChange={(event) => handleMonthChange(event.target.value)}
        >
          <option value="">All-time</option>
          {availableMonths.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </label>
      {isPending ? <span className="inline-flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-heading shadow-shadow"><LoadingDots /> Loading...</span> : null}
      {selectedMonth ? (
        <Button type="button" variant="neutral" size="sm" className="w-full sm:w-auto" onClick={() => handleMonthChange("")} disabled={isPending}>
          {isPending ? <><LoadingDots /> Loading...</> : <><X className="size-3" /> Clear Filter</>}
        </Button>
      ) : null}
    </div>
  );
}

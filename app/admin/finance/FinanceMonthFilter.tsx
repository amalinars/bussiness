"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type FinanceMonthFilterProps = {
  selectedMonth: string;
  availableMonths: { value: string; label: string }[];
};

export function FinanceMonthFilter({ selectedMonth, availableMonths }: FinanceMonthFilterProps) {
  const router = useRouter();

  function handleMonthChange(month: string) {
    router.push(month ? `/admin/finance?month=${encodeURIComponent(month)}` : "/admin/finance");
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
      <label className="flex w-full flex-col gap-1 text-sm font-heading sm:w-auto sm:flex-row sm:items-center">
        Filter by Month:
        <select
          name="month"
          value={selectedMonth}
          className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border sm:ml-2 sm:w-auto sm:py-1.5"
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
      {selectedMonth ? (
        <Button type="button" variant="neutral" size="sm" className="w-full sm:w-auto" onClick={() => handleMonthChange("")}>
          <X className="size-3" /> Clear Filter
        </Button>
      ) : null}
    </div>
  );
}

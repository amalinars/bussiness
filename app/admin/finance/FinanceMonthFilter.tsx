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
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-heading">
        Filter by Month:
        <select
          name="month"
          value={selectedMonth}
          className="ml-2 rounded-base border-2 border-border bg-background px-3 py-1.5 font-base outline-none focus:ring-2 focus:ring-border"
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
        <Button type="button" variant="neutral" size="sm" onClick={() => handleMonthChange("")}>
          <X className="size-3" /> Clear Filter
        </Button>
      ) : null}
    </div>
  );
}

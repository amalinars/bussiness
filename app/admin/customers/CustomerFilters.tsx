"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { CUSTOMER_STATUSES } from "@/lib/statuses";
import type { CustomerStatus } from "@/types/database";

type CustomerFiltersProps = {
  q?: string;
  status?: CustomerStatus | "all";
};

export function CustomerFilters({ q = "", status = "all" }: CustomerFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(q);
  const [selectedStatus, setSelectedStatus] = useState(status);

  function updateUrl(nextQuery: string, nextStatus: CustomerStatus | "all") {
    const params = new URLSearchParams(searchParams);
    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    } else {
      params.delete("q");
    }

    if (nextStatus !== "all") {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }

    const search = params.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl(query, selectedStatus);
  }

  function clearFilters() {
    setQuery("");
    setSelectedStatus("all");
    router.push(pathname);
  }

  return (
    <form
      onSubmit={submitFilters}
      className="grid gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow sm:grid-cols-2 lg:grid-cols-[1fr_180px_auto_auto] lg:items-end"
    >
      <label className="min-w-0 space-y-1 text-sm font-heading sm:col-span-2 lg:col-span-1">
        Search customer
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, contact, phone, email..."
          className="min-w-0 w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
        />
      </label>
      <label className="min-w-0 space-y-1 text-sm font-heading">
        Status
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as CustomerStatus | "all")}
          className="min-w-0 w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
        >
          <option value="all">all</option>
          {CUSTOMER_STATUSES.map((customerStatus) => (
            <option key={customerStatus} value={customerStatus}>
              {customerStatus}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" className="w-full">
        Apply
      </Button>
      <Button type="button" variant="neutral" className="w-full" onClick={clearFilters}>
        Clear
      </Button>
    </form>
  );
}

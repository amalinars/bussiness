"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { SERVICE_ACCOUNT_STATUSES } from "@/lib/statuses";
import type { ServiceAccountStatus } from "@/types/database";

type ServiceAccountFiltersProps = {
  q?: string;
  status?: ServiceAccountStatus | "all";
};

export function ServiceAccountFilters({ q = "", status = "all" }: ServiceAccountFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(q);
  const [selectedStatus, setSelectedStatus] = useState(status);

  function updateUrl(nextQuery: string, nextStatus: ServiceAccountStatus | "all") {
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
      className="grid gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow md:grid-cols-[1fr_180px_auto_auto] md:items-end"
    >
      <label className="space-y-1 text-sm font-heading">
        Search service accounts
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Label, service name, ID, ref..."
          className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
        />
      </label>
      <label className="space-y-1 text-sm font-heading">
        Status
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as ServiceAccountStatus | "all")}
          className="w-full rounded-base border-2 border-border bg-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
        >
          <option value="all">all</option>
          {SERVICE_ACCOUNT_STATUSES.map((accStatus) => (
            <option key={accStatus} value={accStatus}>
              {accStatus}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit">Apply</Button>
      <Button type="button" variant="neutral" onClick={clearFilters}>
        Clear
      </Button>
    </form>
  );
}

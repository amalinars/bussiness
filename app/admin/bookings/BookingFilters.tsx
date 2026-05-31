"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_STATUSES } from "@/lib/statuses";
import type { SubscriptionStatus } from "@/types/database";

type BookingFiltersProps = {
  q?: string;
  status?: SubscriptionStatus | "all";
  serviceAccountId?: string | "all";
  serviceAccounts: {
    id: string;
    label: string;
    service_name: string;
  }[];
};

export function BookingFilters({ q = "", status = "all", serviceAccountId = "all", serviceAccounts }: BookingFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(q);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedServiceAccountId, setSelectedServiceAccountId] = useState(serviceAccountId);

  function updateUrl(nextQuery: string, nextStatus: SubscriptionStatus | "all", nextServiceAccountId: string | "all") {
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

    if (nextServiceAccountId !== "all") {
      params.set("account", nextServiceAccountId);
    } else {
      params.delete("account");
    }

    const search = params.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl(query, selectedStatus, selectedServiceAccountId);
  }

  function clearFilters() {
    setQuery("");
    setSelectedStatus("all");
    setSelectedServiceAccountId("all");
    router.push(pathname);
  }

  return (
    <form
      onSubmit={submitFilters}
      className="grid gap-3 rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow sm:grid-cols-2 lg:grid-cols-[1fr_220px_180px_auto_auto] lg:items-end"
    >
      <label className="min-w-0 space-y-1 text-sm font-heading sm:col-span-2 lg:col-span-1">
        Search booking
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Customer, account, package..."
          className="min-w-0 w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
        />
      </label>
      <label className="min-w-0 space-y-1 text-sm font-heading">
        Service account
        <select
          value={selectedServiceAccountId}
          onChange={(event) => setSelectedServiceAccountId(event.target.value)}
          className="min-w-0 w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
        >
          <option value="all">All accounts</option>
          {serviceAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.label} — {account.service_name}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-0 space-y-1 text-sm font-heading">
        Status
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as SubscriptionStatus | "all")}
          className="min-w-0 w-full rounded-base border-2 border-border bg-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
        >
          <option value="all">all</option>
          {SUBSCRIPTION_STATUSES.map((subscriptionStatus) => (
            <option key={subscriptionStatus} value={subscriptionStatus}>
              {subscriptionStatus}
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

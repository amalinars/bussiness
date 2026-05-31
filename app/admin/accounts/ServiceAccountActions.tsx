"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ServiceAccount } from "@/types/database";

import { archiveServiceAccountAction } from "./actions";
import { ServiceAccountFormDialog } from "./ServiceAccountFormDialog";

type ServiceAccountActionsProps = {
  account: ServiceAccount;
};

export function ServiceAccountActions({ account }: ServiceAccountActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant="neutral">
        <Link href={`/admin/accounts/${account.id}`}>Profiles</Link>
      </Button>
      <ServiceAccountFormDialog account={account} />
      <form
        action={archiveServiceAccountAction}
        onSubmit={(event) => {
          if (!confirm(`Archive ${account.label}?`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={account.id} />
        <Button type="submit" size="sm" variant="neutral" disabled={account.status === "archived"}>
          Archive
        </Button>
      </form>
    </div>
  );
}

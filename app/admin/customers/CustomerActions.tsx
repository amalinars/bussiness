"use client";

import { PendingSubmitButton } from "@/components/PendingSubmitButton";
import type { Customer } from "@/types/database";

import { archiveCustomerAction } from "./actions";
import { CustomerFormDialog } from "./CustomerFormDialog";

type CustomerActionsProps = {
  customer: Customer;
};

export function CustomerActions({ customer }: CustomerActionsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <CustomerFormDialog customer={customer} />
      <form
        className="w-full sm:w-auto"
        action={archiveCustomerAction}
        onSubmit={(event) => {
          if (!confirm(`Archive ${customer.name}?`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={customer.id} />
        <PendingSubmitButton idleLabel="Archive" pendingLabel="Archiving..." size="sm" variant="neutral" className="w-full sm:w-auto" disabled={customer.status === "archived"}>
          Archive
        </PendingSubmitButton>
      </form>
    </div>
  );
}

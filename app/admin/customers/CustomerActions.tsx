"use client";

import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/database";

import { archiveCustomerAction } from "./actions";
import { CustomerFormDialog } from "./CustomerFormDialog";

type CustomerActionsProps = {
  customer: Customer;
};

export function CustomerActions({ customer }: CustomerActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <CustomerFormDialog customer={customer} />
      <form
        action={archiveCustomerAction}
        onSubmit={(event) => {
          if (!confirm(`Archive ${customer.name}?`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={customer.id} />
        <Button type="submit" size="sm" variant="neutral" disabled={customer.status === "archived"}>
          Archive
        </Button>
      </form>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";

import { LoadingDots } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CUSTOMER_STATUSES } from "@/lib/statuses";
import type { Customer } from "@/types/database";

import { createCustomerAction, updateCustomerAction, type CustomerActionState } from "./actions";

const initialState: CustomerActionState = {
  ok: false,
  error: null,
};

type CustomerFormDialogProps = {
  customer?: Customer;
};

export function CustomerFormDialog({ customer }: CustomerFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = customer ? updateCustomerAction : createCustomerAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.ok && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={customer ? "sm" : "default"} variant={customer ? "neutral" : "default"} className="w-full sm:w-auto">
          {customer ? "Edit" : "Add customer"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:max-w-2xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black sm:text-2xl">{customer ? "Edit customer" : "Add customer"}</DialogTitle>
          <DialogDescription>Keep customer records simple, friendly, and easy to scan.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {customer ? <input type="hidden" name="id" value={customer.id} /> : null}

          <fieldset disabled={pending} className="grid gap-4 sm:grid-cols-2 disabled:opacity-70">
            <label className="space-y-1 text-sm font-heading">
              Name
              <input
                required
                name="name"
                defaultValue={customer?.name ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={customer?.status ?? "active"}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              >
                {CUSTOMER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-heading">
              Contact label
              <input
                name="contact_label"
                defaultValue={customer?.contact_label ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Phone
              <input
                name="phone"
                defaultValue={customer?.phone ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Email
              <input
                type="email"
                name="email"
                defaultValue={customer?.email ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Notes
              <textarea
                name="notes"
                defaultValue={customer?.notes ?? ""}
                rows={3}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
          </fieldset>

          {pending ? (
            <p className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-heading">
              <LoadingDots /> Saving customer...
            </p>
          ) : null}

          {state.error ? (
            <p className="wrap-break-word rounded-base border-2 border-border bg-main px-3 py-2 text-sm font-heading">{state.error}</p>
          ) : null}

          <DialogFooter className="gap-2">
            <Button type="button" variant="neutral" className="w-full sm:w-auto" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
              {pending ? "Saving..." : "Save customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useActionState, useState } from "react";

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

  async function submitAction(formData: FormData) {
    await formAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={customer ? "sm" : "default"} variant={customer ? "neutral" : "default"}>
          {customer ? "Edit" : "Add customer"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">{customer ? "Edit customer" : "Add customer"}</DialogTitle>
          <DialogDescription>Keep customer records simple, friendly, and easy to scan.</DialogDescription>
        </DialogHeader>

        <form action={submitAction} className="space-y-5">
          {customer ? <input type="hidden" name="id" value={customer.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-heading">
              Name
              <input
                required
                name="name"
                defaultValue={customer?.name ?? ""}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={customer?.status ?? "active"}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
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
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Phone
              <input
                name="phone"
                defaultValue={customer?.phone ?? ""}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Email
              <input
                type="email"
                name="email"
                defaultValue={customer?.email ?? ""}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Notes
              <textarea
                name="notes"
                defaultValue={customer?.notes ?? ""}
                rows={3}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
          </div>

          {state.error ? (
            <p className="rounded-base border-2 border-border bg-main px-3 py-2 text-sm font-heading">{state.error}</p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

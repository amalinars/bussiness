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
import { SERVICE_ACCOUNT_STATUSES } from "@/lib/statuses";
import type { ServiceAccount } from "@/types/database";

import { createServiceAccountAction, updateServiceAccountAction, type ServiceAccountActionState } from "./actions";

const initialState: ServiceAccountActionState = {
  ok: false,
  error: null,
};

type ServiceAccountFormDialogProps = {
  account?: ServiceAccount;
};

export function ServiceAccountFormDialog({ account }: ServiceAccountFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = account ? updateServiceAccountAction : createServiceAccountAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.ok && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={account ? "sm" : "default"} variant={account ? "neutral" : "default"} className="w-full sm:w-auto">
          {account ? "Edit" : "Add service account"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:max-w-3xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black sm:text-2xl">
            {account ? "Edit service account" : "Add service account"}
          </DialogTitle>
          <DialogDescription>Track account inventory, password, and slot capacity for internal use.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {account ? <input type="hidden" name="id" value={account.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-heading">
              Account label
              <input
                required
                name="label"
                defaultValue={account?.label ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Service name
              <input
                required
                name="service_name"
                defaultValue={account?.service_name ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Account identifier
              <input
                name="account_identifier"
                defaultValue={account?.account_identifier ?? ""}
                placeholder="Email, username, or account ref"
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Account password
              <input
                name="account_password"
                defaultValue={account?.account_password ?? ""}
                placeholder="Password from account sheet"
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Credential reference
              <input
                name="credential_reference"
                defaultValue={account?.credential_reference ?? ""}
                placeholder="Optional credential note/reference"
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Total slots
              <input
                required
                type="number"
                min="0"
                step="1"
                name="total_slots"
                defaultValue={account?.total_slots ?? 0}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Used slots
              <input
                required
                type="number"
                min="0"
                step="1"
                name="used_slots"
                defaultValue={account?.used_slots ?? 0}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={account?.status ?? "active"}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              >
                {SERVICE_ACCOUNT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-heading">
              Renewal date
              <input
                type="date"
                name="renewal_date"
                defaultValue={account?.renewal_date ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Notes
              <textarea
                name="notes"
                defaultValue={account?.notes ?? ""}
                rows={3}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
          </div>

          {state.error ? (
            <p className="wrap-break-word rounded-base border-2 border-border bg-main px-3 py-2 text-sm font-heading">{state.error}</p>
          ) : null}

          <DialogFooter className="gap-2">
            <Button type="button" variant="neutral" className="w-full sm:w-auto" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
              {pending ? "Saving..." : "Save service account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

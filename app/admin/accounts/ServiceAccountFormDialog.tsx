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

  async function submitAction(formData: FormData) {
    await formAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={account ? "sm" : "default"} variant={account ? "neutral" : "default"}>
          {account ? "Edit" : "Add service account"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {account ? "Edit service account" : "Add service account"}
          </DialogTitle>
          <DialogDescription>Track account inventory and slot capacity. Do not store passwords here.</DialogDescription>
        </DialogHeader>

        <form action={submitAction} className="space-y-5">
          {account ? <input type="hidden" name="id" value={account.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-heading">
              Account label
              <input
                required
                name="label"
                defaultValue={account?.label ?? ""}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Service name
              <input
                required
                name="service_name"
                defaultValue={account?.service_name ?? ""}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Account identifier
              <input
                name="account_identifier"
                defaultValue={account?.account_identifier ?? ""}
                placeholder="Email, username, or account ref"
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Credential reference
              <input
                name="credential_reference"
                defaultValue={account?.credential_reference ?? ""}
                placeholder="Vault/ref only, no password"
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
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
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
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
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={account?.status ?? "active"}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
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
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Notes
              <textarea
                name="notes"
                defaultValue={account?.notes ?? ""}
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
              {pending ? "Saving..." : "Save service account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

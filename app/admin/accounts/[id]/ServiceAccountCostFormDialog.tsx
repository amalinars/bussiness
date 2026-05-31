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
import { SERVICE_ACCOUNT_COST_STATUSES } from "@/lib/statuses";
import type { ServiceAccountCost } from "@/types/database";

import {
  createServiceAccountCostAction,
  updateServiceAccountCostAction,
  type ServiceAccountCostActionState,
} from "./cost-actions";

const initialState: ServiceAccountCostActionState = {
  ok: false,
  error: null,
};

type ServiceAccountCostFormDialogProps = {
  serviceAccountId: string;
  cost?: ServiceAccountCost;
};

export function ServiceAccountCostFormDialog({ serviceAccountId, cost }: ServiceAccountCostFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = cost ? updateServiceAccountCostAction : createServiceAccountCostAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.ok && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={cost ? "sm" : "default"} variant={cost ? "neutral" : "default"} className="w-full sm:w-auto">
          {cost ? "Edit" : "Add cost"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:max-w-2xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black sm:text-2xl">{cost ? "Edit cost" : "Add cost"}</DialogTitle>
          <DialogDescription>Record service account spending, payment date, and covered period.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="service_account_id" value={serviceAccountId} />
          {cost ? <input type="hidden" name="cost_id" value={cost.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-heading">
              Cost date
              <input
                required
                type="date"
                name="cost_date"
                defaultValue={cost?.cost_date ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Amount
              <input
                required
                type="number"
                min="0"
                name="amount"
                defaultValue={cost?.amount ?? ""}
                placeholder="54000"
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Period start
              <input
                required
                type="date"
                name="period_start"
                defaultValue={cost?.period_start ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Period end
              <input
                required
                type="date"
                name="period_end"
                defaultValue={cost?.period_end ?? ""}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={cost?.status ?? "paid"}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              >
                {SERVICE_ACCOUNT_COST_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Notes
              <textarea
                name="notes"
                defaultValue={cost?.notes ?? ""}
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
              {pending ? "Saving..." : "Save cost"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

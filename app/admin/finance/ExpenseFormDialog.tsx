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
import { SERVICE_ACCOUNT_COST_STATUSES } from "@/lib/statuses";
import type { ServiceAccount, ServiceAccountCost, ServiceAccountCostStatus } from "@/types/database";

import { createExpenseAction, updateExpenseAction, type ExpenseActionState } from "./actions";

const initialState: ExpenseActionState = {
  ok: false,
  error: null,
};

type ExpenseFormDialogProps = {
  expense?: ServiceAccountCost;
  accounts: Pick<ServiceAccount, "id" | "label" | "service_name">[];
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseFormDialog({ expense, accounts }: ExpenseFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = expense ? updateExpenseAction : createExpenseAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [selectedAccountId, setSelectedAccountId] = useState(expense?.service_account_id ?? accounts[0]?.id ?? "");
  const [costDate, setCostDate] = useState(expense?.cost_date ?? todayString());
  const [periodStart, setPeriodStart] = useState(expense?.period_start ?? todayString());
  const [periodEnd, setPeriodEnd] = useState(expense?.period_end ?? todayString());
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [notes, setNotes] = useState(expense?.notes ?? "");
  const [status, setStatus] = useState<ServiceAccountCostStatus>(expense?.status ?? "paid");

  if (state.ok && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={expense ? "sm" : "default"} variant={expense ? "neutral" : "default"} className="w-full sm:w-auto">
          {expense ? "Edit" : "Add Expense"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:max-w-xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black sm:text-2xl">{expense ? "Edit Expense" : "Record Supplier Expense"}</DialogTitle>
          <DialogDescription>
            Record costs incurred for supplier accounts (e.g. buying Netflix/Spotify account slots).
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {expense ? <input type="hidden" name="id" value={expense.id} /> : null}

          <fieldset disabled={pending} className="grid gap-4 disabled:opacity-70">
            <label className="space-y-1 text-sm font-heading">
              Service Account
              <select
                required
                name="service_account_id"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              >
                <option value="">Select service account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label} ({account.service_name})
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-heading">
                Cost Date (Payment Date)
                <input
                  required
                  type="date"
                  name="cost_date"
                  value={costDate}
                  onChange={(e) => setCostDate(e.target.value)}
                  className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                />
              </label>

              <label className="space-y-1 text-sm font-heading">
                Expense Amount (Rp)
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  name="amount"
                  placeholder="E.g. 150000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm font-heading">
                Period Start
                <input
                  required
                  type="date"
                  name="period_start"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                />
              </label>

              <label className="space-y-1 text-sm font-heading">
                Period End
                <input
                  required
                  type="date"
                  name="period_end"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ServiceAccountCostStatus)}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              >
                {SERVICE_ACCOUNT_COST_STATUSES.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm font-heading">
              Notes (Catatan)
              <textarea
                name="notes"
                placeholder="E.g. Paid to supplier Jojo via BCA"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
          </fieldset>

          {pending ? (
            <p className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-heading">
              <LoadingDots /> Saving expense...
            </p>
          ) : null}

          {state.error ? (
            <p className="rounded-base border-2 border-border bg-main px-3 py-2 text-sm font-heading">{state.error}</p>
          ) : null}

          <DialogFooter className="gap-2">
            <Button type="button" variant="neutral" className="w-full sm:w-auto" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
              {pending ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

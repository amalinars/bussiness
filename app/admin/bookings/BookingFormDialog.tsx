"use client";

import { useActionState, useMemo, useState } from "react";

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
import { SUBSCRIPTION_STATUSES } from "@/lib/statuses";
import type { SubscriptionFormOptionsResult, SubscriptionListItem } from "@/lib/subscriptions";

import { createBookingAction, updateBookingAction, type BookingActionState } from "./actions";

const initialState: BookingActionState = {
  ok: false,
  error: null,
};

type BookingFormDialogProps = {
  booking?: SubscriptionListItem;
  options: Extract<SubscriptionFormOptionsResult, { error: null }>;
};

function addDays(dateValue: string, durationDays: number) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + durationDays);
  return date.toISOString().slice(0, 10);
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingFormDialog({ booking, options }: BookingFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = booking ? updateBookingAction : createBookingAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [selectedAccountId, setSelectedAccountId] = useState(booking?.service_account_id ?? options.serviceAccounts[0]?.id ?? "");
  const [selectedProfileId, setSelectedProfileId] = useState(booking?.service_account_profile_id ?? "");
  const [selectedPackageId, setSelectedPackageId] = useState(booking?.rental_package_id ?? options.rentalPackages[0]?.id ?? "");
  const [startDate, setStartDate] = useState(booking?.start_date ?? todayString());
  const [price, setPrice] = useState(String(booking?.price_snapshot ?? options.rentalPackages[0]?.default_price ?? 0));

  const selectedPackage = useMemo(
    () => options.rentalPackages.find((rentalPackage) => rentalPackage.id === selectedPackageId),
    [options.rentalPackages, selectedPackageId],
  );
  const availableProfiles = options.profiles.filter((profile) => profile.service_account_id === selectedAccountId);
  const endDate = addDays(startDate, selectedPackage?.duration_days ?? 0);

  async function submitAction(formData: FormData) {
    await formAction(formData);
    setOpen(false);
  }

  function updatePackage(packageId: string) {
    setSelectedPackageId(packageId);
    const nextPackage = options.rentalPackages.find((rentalPackage) => rentalPackage.id === packageId);
    setPrice(String(nextPackage?.default_price ?? 0));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={booking ? "sm" : "default"} variant={booking ? "neutral" : "default"}>
          {booking ? "Edit" : "Add booking"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">{booking ? "Edit booking" : "Add booking"}</DialogTitle>
          <DialogDescription>Create a booking from customer, account profile, and rental package.</DialogDescription>
        </DialogHeader>

        <form action={submitAction} className="space-y-5">
          {booking ? <input type="hidden" name="id" value={booking.id} /> : null}
          <input type="hidden" name="end_date" value={endDate} />

          {!booking ? (
            <div className="grid gap-3 rounded-base border-2 border-border bg-secondary-background p-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm font-heading">
                <input
                  type="radio"
                  name="customer_mode"
                  value="existing"
                  checked={customerMode === "existing"}
                  onChange={() => setCustomerMode("existing")}
                />
                Existing customer
              </label>
              <label className="flex items-center gap-2 text-sm font-heading">
                <input
                  type="radio"
                  name="customer_mode"
                  value="new"
                  checked={customerMode === "new"}
                  onChange={() => setCustomerMode("new")}
                />
                New customer
              </label>
            </div>
          ) : (
            <input type="hidden" name="customer_mode" value="existing" />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {customerMode === "existing" || booking ? (
              <label className="space-y-1 text-sm font-heading sm:col-span-2">
                Customer
                <select
                  required
                  name="customer_id"
                  defaultValue={booking?.customer_id ?? ""}
                  className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
                >
                  <option value="">Select customer</option>
                  {options.customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}{customer.contact_label ? ` — ${customer.contact_label}` : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-heading">
                  New customer name
                  <input
                    required
                    name="new_customer_name"
                    className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading">
                  Contact label
                  <input
                    name="new_customer_contact_label"
                    className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading">
                  Phone
                  <input
                    name="new_customer_phone"
                    className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading">
                  Email
                  <input
                    type="email"
                    name="new_customer_email"
                    className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading sm:col-span-2">
                  Customer notes
                  <input
                    name="new_customer_notes"
                    className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
                  />
                </label>
              </div>
            )}

            <label className="space-y-1 text-sm font-heading">
              Service account
              <select
                required
                name="service_account_id"
                value={selectedAccountId}
                onChange={(event) => {
                  setSelectedAccountId(event.target.value);
                  setSelectedProfileId("");
                }}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              >
                <option value="">Select account</option>
                {options.serviceAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label} — {account.service_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-heading">
              Profile
              <select
                required
                name="service_account_profile_id"
                value={selectedProfileId}
                onChange={(event) => setSelectedProfileId(event.target.value)}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              >
                <option value="">Select profile</option>
                {availableProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.profile_name}{profile.profile_pin ? ` — PIN ${profile.profile_pin}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-heading">
              Package
              <select
                required
                name="rental_package_id"
                value={selectedPackageId}
                onChange={(event) => updatePackage(event.target.value)}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              >
                <option value="">Select package</option>
                {options.rentalPackages.map((rentalPackage) => (
                  <option key={rentalPackage.id} value={rentalPackage.id}>
                    {rentalPackage.name} — Rp {rentalPackage.default_price.toLocaleString("id-ID")}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-heading">
              Price
              <input
                required
                type="number"
                min="0"
                step="1"
                name="price_snapshot"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Start date
              <input
                required
                type="date"
                name="start_date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              End date
              <input
                readOnly
                value={endDate}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={booking?.status ?? "booked"}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              >
                {SUBSCRIPTION_STATUSES.map((status) => (
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
                defaultValue={booking?.notes ?? ""}
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
              {pending ? "Saving..." : "Save booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

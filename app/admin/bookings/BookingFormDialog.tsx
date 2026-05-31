"use client";

import { useActionState, useMemo, useState } from "react";

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
  const initialStartDate = booking?.start_date ?? todayString();
  const initialPackage = options.rentalPackages.find((rentalPackage) => rentalPackage.id === booking?.rental_package_id) ?? options.rentalPackages[0];
  const [selectedAccountId, setSelectedAccountId] = useState(booking?.service_account_id ?? options.serviceAccounts[0]?.id ?? "");
  const [selectedProfileId, setSelectedProfileId] = useState(booking?.service_account_profile_id ?? "");
  const [selectedPackageId, setSelectedPackageId] = useState(booking?.rental_package_id ?? options.rentalPackages[0]?.id ?? "");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(booking?.end_date ?? addDays(initialStartDate, initialPackage?.duration_days ?? 0));
  const [endTime, setEndTime] = useState(booking?.end_time ? booking.end_time.slice(0, 5) : "23:59");
  const [price, setPrice] = useState(String(booking?.price_snapshot ?? options.rentalPackages[0]?.default_price ?? 0));

  const selectedPackage = useMemo(
    () => options.rentalPackages.find((rentalPackage) => rentalPackage.id === selectedPackageId),
    [options.rentalPackages, selectedPackageId],
  );
  const availableProfiles = options.profiles.filter(
    (profile) =>
      profile.service_account_id === selectedAccountId &&
      (profile.status === "available" || profile.id === booking?.service_account_profile_id),
  );

  function updatePackage(packageId: string) {
    setSelectedPackageId(packageId);
    const nextPackage = options.rentalPackages.find((rentalPackage) => rentalPackage.id === packageId);
    setPrice(String(nextPackage?.default_price ?? 0));
    setEndDate(addDays(startDate, nextPackage?.duration_days ?? 0));
  }

  function handleStartDateChange(date: string) {
    setStartDate(date);
    setEndDate(addDays(date, selectedPackage?.duration_days ?? 0));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={booking ? "sm" : "default"} variant={booking ? "neutral" : "default"} className="w-full sm:w-auto">
          {booking ? "Edit" : "Add booking"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:max-w-4xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black sm:text-2xl">{booking ? "Edit booking" : "Add booking"}</DialogTitle>
          <DialogDescription>Create a booking from customer, account profile, and rental package.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {booking ? <input type="hidden" name="id" value={booking.id} /> : null}

          <fieldset disabled={pending} className="space-y-5 disabled:opacity-70">
          {!booking ? (
            <div className="grid gap-3 rounded-base border-2 border-border bg-secondary-background p-3 md:grid-cols-2">
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

          <div className="grid gap-4 md:grid-cols-2">
            {customerMode === "existing" || booking ? (
              <label className="space-y-1 text-sm font-heading md:col-span-2">
                Customer
                <select
                  required
                  name="customer_id"
                  defaultValue={booking?.customer_id ?? ""}
                  className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
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
              <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                <label className="space-y-1 text-sm font-heading">
                  New customer name
                  <input
                    required
                    name="new_customer_name"
                    className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading">
                  Contact label
                  <input
                    name="new_customer_contact_label"
                    className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading">
                  Phone
                  <input
                    name="new_customer_phone"
                    className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading">
                  Email
                  <input
                    type="email"
                    name="new_customer_email"
                    className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
                  />
                </label>
                <label className="space-y-1 text-sm font-heading md:col-span-2">
                  Customer notes
                  <input
                    name="new_customer_notes"
                    className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
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
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
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
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
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
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
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
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Start date
              <input
                required
                type="date"
                name="start_date"
                value={startDate}
                onChange={(event) => handleStartDateChange(event.target.value)}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              End date
              <input
                required
                type="date"
                name="end_date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              End time
              <input
                required
                type="time"
                name="end_time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={booking?.status ?? "booked"}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              >
                {SUBSCRIPTION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-heading md:col-span-2">
              Notes
              <textarea
                name="notes"
                defaultValue={booking?.notes ?? ""}
                rows={3}
                className="min-w-0 w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-base outline-none focus:ring-2 focus:ring-border sm:text-base"
              />
            </label>
          </div>
          </fieldset>

          {pending ? (
            <p className="flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-heading">
              <LoadingDots /> Saving booking...
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
              {pending ? "Saving..." : "Save booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use server";

import { revalidatePath } from "next/cache";

import { archiveSubscription, createSubscription, updateSubscription } from "@/lib/subscriptions";
import type { SubscriptionStatus } from "@/types/database";

export type BookingActionState = {
  ok: boolean;
  error: string | null;
};

const initialBookingActionState: BookingActionState = {
  ok: false,
  error: null,
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function bookingInputFromFormData(formData: FormData) {
  return {
    customer_mode: formValue(formData, "customer_mode") as "existing" | "new",
    customer_id: formValue(formData, "customer_id"),
    new_customer_name: formValue(formData, "new_customer_name"),
    new_customer_contact_label: formValue(formData, "new_customer_contact_label"),
    new_customer_phone: formValue(formData, "new_customer_phone"),
    new_customer_email: formValue(formData, "new_customer_email"),
    new_customer_notes: formValue(formData, "new_customer_notes"),
    service_account_id: formValue(formData, "service_account_id"),
    service_account_profile_id: formValue(formData, "service_account_profile_id"),
    rental_package_id: formValue(formData, "rental_package_id"),
    start_date: formValue(formData, "start_date"),
    end_date: formValue(formData, "end_date"),
    price_snapshot: formValue(formData, "price_snapshot"),
    end_time: formValue(formData, "end_time"),
    status: formValue(formData, "status") as SubscriptionStatus,
    notes: formValue(formData, "notes"),
  };
}

export async function createBookingAction(
  previousState: BookingActionState = initialBookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  void previousState;
  const result = await createSubscription(bookingInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/accounts");
  revalidatePath("/admin/dashboard");

  return { ok: true, error: null };
}

export async function updateBookingAction(
  previousState: BookingActionState = initialBookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  void previousState;
  const id = formValue(formData, "id");

  if (!id) {
    return { ok: false, error: "Booking id is required." };
  }

  const result = await updateSubscription(id, bookingInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/accounts");
  revalidatePath("/admin/dashboard");

  return { ok: true, error: null };
}

export async function archiveBookingAction(formData: FormData): Promise<void> {
  const id = formValue(formData, "id");

  if (!id) {
    return;
  }

  const result = await archiveSubscription(id);

  if (result.ok) {
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/accounts");
    revalidatePath("/admin/dashboard");
  }
}

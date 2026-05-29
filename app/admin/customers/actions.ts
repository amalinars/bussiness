"use server";

import { revalidatePath } from "next/cache";

import { archiveCustomer, createCustomer, updateCustomer } from "@/lib/customers";
import type { CustomerStatus } from "@/types/database";

export type CustomerActionState = {
  ok: boolean;
  error: string | null;
};

const initialCustomerActionState: CustomerActionState = {
  ok: false,
  error: null,
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function customerInputFromFormData(formData: FormData) {
  return {
    name: formValue(formData, "name"),
    contact_label: formValue(formData, "contact_label"),
    phone: formValue(formData, "phone"),
    email: formValue(formData, "email"),
    status: formValue(formData, "status") as CustomerStatus,
    notes: formValue(formData, "notes"),
  };
}

export async function createCustomerAction(
  previousState: CustomerActionState = initialCustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  void previousState;
  const result = await createCustomer(customerInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/customers");

  return { ok: true, error: null };
}

export async function updateCustomerAction(
  previousState: CustomerActionState = initialCustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  void previousState;
  const id = formValue(formData, "id");

  if (!id) {
    return { ok: false, error: "Customer id is required." };
  }

  const result = await updateCustomer(id, customerInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/customers");

  return { ok: true, error: null };
}

export async function archiveCustomerAction(formData: FormData): Promise<void> {
  const id = formValue(formData, "id");

  if (!id) {
    return;
  }

  const result = await archiveCustomer(id);

  if (result.ok) {
    revalidatePath("/admin/customers");
  }
}

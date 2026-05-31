"use server";

import { revalidatePath } from "next/cache";

import { archiveServiceAccount, createServiceAccount, updateServiceAccount } from "@/lib/service-accounts";
import type { ServiceAccountStatus } from "@/types/database";

export type ServiceAccountActionState = {
  ok: boolean;
  error: string | null;
};

const initialServiceAccountActionState: ServiceAccountActionState = {
  ok: false,
  error: null,
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function serviceAccountInputFromFormData(formData: FormData) {
  return {
    label: formValue(formData, "label"),
    service_name: formValue(formData, "service_name"),
    account_identifier: formValue(formData, "account_identifier"),
    account_password: formValue(formData, "account_password"),
    credential_reference: formValue(formData, "credential_reference"),
    total_slots: formValue(formData, "total_slots"),
    used_slots: formValue(formData, "used_slots"),
    status: formValue(formData, "status") as ServiceAccountStatus,
    renewal_date: formValue(formData, "renewal_date"),
    notes: formValue(formData, "notes"),
  };
}

export async function createServiceAccountAction(
  previousState: ServiceAccountActionState = initialServiceAccountActionState,
  formData: FormData,
): Promise<ServiceAccountActionState> {
  void previousState;
  const result = await createServiceAccount(serviceAccountInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/accounts");

  return { ok: true, error: null };
}

export async function updateServiceAccountAction(
  previousState: ServiceAccountActionState = initialServiceAccountActionState,
  formData: FormData,
): Promise<ServiceAccountActionState> {
  void previousState;
  const id = formValue(formData, "id");

  if (!id) {
    return { ok: false, error: "Service account id is required." };
  }

  const result = await updateServiceAccount(id, serviceAccountInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/accounts");

  return { ok: true, error: null };
}

export async function archiveServiceAccountAction(formData: FormData): Promise<void> {
  const id = formValue(formData, "id");

  if (!id) {
    return;
  }

  const result = await archiveServiceAccount(id);

  if (result.ok) {
    revalidatePath("/admin/accounts");
  }
}

"use server";

import { revalidatePath } from "next/cache";

import {
  archiveServiceAccountProfile,
  createServiceAccountProfile,
  updateServiceAccountProfile,
} from "@/lib/service-account-profiles";
import type { ServiceAccountProfileStatus } from "@/types/database";

export type ServiceAccountProfileActionState = {
  ok: boolean;
  error: string | null;
};

const initialProfileActionState: ServiceAccountProfileActionState = {
  ok: false,
  error: null,
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function profileInputFromFormData(formData: FormData) {
  return {
    profile_name: formValue(formData, "profile_name"),
    profile_pin: formValue(formData, "profile_pin"),
    is_rentable: formData.get("is_rentable") === "on",
    status: formValue(formData, "status") as ServiceAccountProfileStatus,
    notes: formValue(formData, "notes"),
  };
}

export async function createServiceAccountProfileAction(
  previousState: ServiceAccountProfileActionState = initialProfileActionState,
  formData: FormData,
): Promise<ServiceAccountProfileActionState> {
  void previousState;
  const serviceAccountId = formValue(formData, "service_account_id");

  if (!serviceAccountId) {
    return { ok: false, error: "Service account id is required." };
  }

  const result = await createServiceAccountProfile(serviceAccountId, profileInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath(`/admin/accounts/${serviceAccountId}`);
  revalidatePath("/admin/dashboard");

  return { ok: true, error: null };
}

export async function updateServiceAccountProfileAction(
  previousState: ServiceAccountProfileActionState = initialProfileActionState,
  formData: FormData,
): Promise<ServiceAccountProfileActionState> {
  void previousState;
  const serviceAccountId = formValue(formData, "service_account_id");
  const profileId = formValue(formData, "profile_id");

  if (!serviceAccountId || !profileId) {
    return { ok: false, error: "Service account and profile id are required." };
  }

  const result = await updateServiceAccountProfile(serviceAccountId, profileId, profileInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath(`/admin/accounts/${serviceAccountId}`);
  revalidatePath("/admin/dashboard");

  return { ok: true, error: null };
}

export async function archiveServiceAccountProfileAction(formData: FormData): Promise<void> {
  const serviceAccountId = formValue(formData, "service_account_id");
  const profileId = formValue(formData, "profile_id");

  if (!serviceAccountId || !profileId) {
    return;
  }

  const result = await archiveServiceAccountProfile(profileId);

  if (result.ok) {
    revalidatePath(`/admin/accounts/${serviceAccountId}`);
    revalidatePath("/admin/dashboard");
  }
}

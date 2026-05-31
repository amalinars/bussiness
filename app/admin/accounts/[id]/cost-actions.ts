"use server";

import { revalidatePath } from "next/cache";

import {
  cancelServiceAccountCost,
  createServiceAccountCost,
  updateServiceAccountCost,
} from "@/lib/service-account-costs";
import type { ServiceAccountCostStatus } from "@/types/database";

export type ServiceAccountCostActionState = {
  ok: boolean;
  error: string | null;
};

const initialCostActionState: ServiceAccountCostActionState = {
  ok: false,
  error: null,
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function costInputFromFormData(formData: FormData) {
  return {
    service_account_id: formValue(formData, "service_account_id"),
    cost_date: formValue(formData, "cost_date"),
    period_start: formValue(formData, "period_start"),
    period_end: formValue(formData, "period_end"),
    amount: formValue(formData, "amount"),
    status: formValue(formData, "status") as ServiceAccountCostStatus,
    notes: formValue(formData, "notes"),
  };
}

function revalidateFinancialPaths(serviceAccountId: string) {
  revalidatePath("/admin/accounts");
  revalidatePath(`/admin/accounts/${serviceAccountId}`);
  revalidatePath("/admin/dashboard");
}

export async function createServiceAccountCostAction(
  previousState: ServiceAccountCostActionState = initialCostActionState,
  formData: FormData,
): Promise<ServiceAccountCostActionState> {
  void previousState;
  const serviceAccountId = formValue(formData, "service_account_id");

  if (!serviceAccountId) {
    return { ok: false, error: "Service account id is required." };
  }

  const result = await createServiceAccountCost(costInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidateFinancialPaths(serviceAccountId);

  return { ok: true, error: null };
}

export async function updateServiceAccountCostAction(
  previousState: ServiceAccountCostActionState = initialCostActionState,
  formData: FormData,
): Promise<ServiceAccountCostActionState> {
  void previousState;
  const serviceAccountId = formValue(formData, "service_account_id");
  const costId = formValue(formData, "cost_id");

  if (!serviceAccountId || !costId) {
    return { ok: false, error: "Service account and cost id are required." };
  }

  const result = await updateServiceAccountCost(costId, costInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidateFinancialPaths(serviceAccountId);

  return { ok: true, error: null };
}

export async function cancelServiceAccountCostAction(formData: FormData): Promise<void> {
  const serviceAccountId = formValue(formData, "service_account_id");
  const costId = formValue(formData, "cost_id");

  if (!serviceAccountId || !costId) {
    return;
  }

  const result = await cancelServiceAccountCost(costId);

  if (result.ok) {
    revalidateFinancialPaths(serviceAccountId);
  }
}

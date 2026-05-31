"use server";

import { revalidatePath } from "next/cache";

import { cancelServiceAccountCost, createServiceAccountCost, updateServiceAccountCost } from "@/lib/service-account-costs";
import type { ServiceAccountCostStatus } from "@/types/database";

export type ExpenseActionState = {
  ok: boolean;
  error: string | null;
};

const initialExpenseActionState: ExpenseActionState = {
  ok: false,
  error: null,
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function expenseInputFromFormData(formData: FormData) {
  return {
    service_account_id: formValue(formData, "service_account_id"),
    cost_date: formValue(formData, "cost_date"),
    period_start: formValue(formData, "period_start"),
    period_end: formValue(formData, "period_end"),
    amount: formValue(formData, "amount"),
    status: (formValue(formData, "status") || "paid") as ServiceAccountCostStatus,
    notes: formValue(formData, "notes"),
  };
}

export async function createExpenseAction(
  previousState: ExpenseActionState = initialExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  void previousState;
  const result = await createServiceAccountCost(expenseInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/finance");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/accounts");

  return { ok: true, error: null };
}

export async function updateExpenseAction(
  previousState: ExpenseActionState = initialExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  void previousState;
  const id = formValue(formData, "id");

  if (!id) {
    return { ok: false, error: "Expense id is required." };
  }

  const result = await updateServiceAccountCost(id, expenseInputFromFormData(formData));

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/admin/finance");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/accounts");

  return { ok: true, error: null };
}

export async function cancelExpenseAction(formData: FormData): Promise<void> {
  const id = formValue(formData, "id");

  if (!id) {
    return;
  }

  const result = await cancelServiceAccountCost(id);

  if (result.ok) {
    revalidatePath("/admin/finance");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/accounts");
  }
}

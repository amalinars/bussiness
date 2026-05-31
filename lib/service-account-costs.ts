import { SERVICE_ACCOUNT_COST_STATUSES } from "@/lib/statuses";
import { supabase } from "@/lib/supabase";
import type { ServiceAccountCost, ServiceAccountCostInsert, ServiceAccountCostStatus, ServiceAccountCostUpdate } from "@/types/database";

export type ServiceAccountCostFormInput = {
  service_account_id: string;
  cost_date: string;
  period_start: string;
  period_end: string;
  amount?: string | number | null;
  status?: ServiceAccountCostStatus;
  notes?: string | null;
};

export type ServiceAccountCostsResult =
  | {
    data: ServiceAccountCost[];
    error: null;
  }
  | {
    data: [];
    error: string;
  };

export type ServiceAccountCostMutationResult =
  | {
    ok: true;
    error: null;
  }
  | {
    ok: false;
    error: string;
  };

function emptyToNull(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function parseAmount(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

function normalizeServiceAccountCostInput(input: ServiceAccountCostFormInput): ServiceAccountCostInsert {
  const status = input.status ?? "paid";
  const amount = parseAmount(input.amount);
  const costDate = input.cost_date.trim();
  const periodStart = input.period_start.trim();
  const periodEnd = input.period_end.trim();

  if (!input.service_account_id) {
    throw new Error("Service account id is required.");
  }

  if (!costDate || !periodStart || !periodEnd) {
    throw new Error("Cost date and period dates are required.");
  }

  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("Amount must be a non-negative whole number.");
  }

  if (periodEnd < periodStart) {
    throw new Error("Period end cannot be before period start.");
  }

  if (!SERVICE_ACCOUNT_COST_STATUSES.some((costStatus) => costStatus === status)) {
    throw new Error("Cost status is not valid.");
  }

  return {
    service_account_id: input.service_account_id,
    cost_date: costDate,
    period_start: periodStart,
    period_end: periodEnd,
    amount,
    status,
    notes: emptyToNull(input.notes),
  };
}

function toMutationError(action: string, error: unknown): ServiceAccountCostMutationResult {
  console.error(action, error);

  return {
    ok: false,
    error: "Service account cost could not be saved right now.",
  };
}

export async function getServiceAccountCosts(serviceAccountId: string): Promise<ServiceAccountCostsResult> {
  const { data, error } = await supabase
    .from("service_account_costs")
    .select("id,service_account_id,cost_date,period_start,period_end,amount,status,notes,created_at,updated_at")
    .eq("service_account_id", serviceAccountId)
    .order("cost_date", { ascending: false });

  if (error) {
    console.error("Failed to load service account costs", error);
    return { data: [], error: "Service account cost data could not be loaded right now." };
  }

  return { data: data ?? [], error: null };
}

export async function createServiceAccountCost(input: ServiceAccountCostFormInput): Promise<ServiceAccountCostMutationResult> {
  let payload: ServiceAccountCostInsert;

  try {
    payload = normalizeServiceAccountCostInput(input);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Service account cost data is not valid." };
  }

  const { error } = await supabase.from("service_account_costs").insert(payload);

  if (error) {
    return toMutationError("Failed to create service account cost", error);
  }

  return { ok: true, error: null };
}

export async function updateServiceAccountCost(id: string, input: ServiceAccountCostFormInput): Promise<ServiceAccountCostMutationResult> {
  let payload: ServiceAccountCostUpdate;

  try {
    payload = normalizeServiceAccountCostInput(input);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Service account cost data is not valid." };
  }

  const { error } = await supabase.from("service_account_costs").update(payload).eq("id", id);

  if (error) {
    return toMutationError("Failed to update service account cost", error);
  }

  return { ok: true, error: null };
}

export async function cancelServiceAccountCost(id: string): Promise<ServiceAccountCostMutationResult> {
  const { error } = await supabase.from("service_account_costs").update({ status: "cancelled" }).eq("id", id);

  if (error) {
    return toMutationError("Failed to cancel service account cost", error);
  }

  return { ok: true, error: null };
}

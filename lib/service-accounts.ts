import { SERVICE_ACCOUNT_STATUSES } from "@/lib/statuses";
import { supabase } from "@/lib/supabase";
import type { ServiceAccount, ServiceAccountInsert, ServiceAccountStatus, ServiceAccountUpdate } from "@/types/database";

export type ServiceAccountsResult =
  | {
    data: ServiceAccount[];
    error: null;
  }
  | {
    data: [];
    error: string;
  };

export type ServiceAccountFormInput = {
  label: string;
  service_name: string;
  account_identifier?: string | null;
  credential_reference?: string | null;
  total_slots?: string | number | null;
  used_slots?: string | number | null;
  status?: ServiceAccountStatus;
  renewal_date?: string | null;
  notes?: string | null;
};

export type ServiceAccountMutationResult =
  | {
    ok: true;
    error: null;
  }
  | {
    ok: false;
    error: string;
  };

export type ServiceAccountFilters = {
  q?: string;
  status?: ServiceAccountStatus | "all";
};

function emptyToNull(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function parseSlotCount(value: string | number | null | undefined, fallback: number) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  return Number(value);
}

function normalizeServiceAccountInput(input: ServiceAccountFormInput): ServiceAccountInsert {
  const label = input.label.trim();
  const serviceName = input.service_name.trim();
  const status = input.status ?? "active";
  const totalSlots = parseSlotCount(input.total_slots, 0);
  const usedSlots = parseSlotCount(input.used_slots, 0);

  if (!label) {
    throw new Error("Service account label is required.");
  }

  if (!serviceName) {
    throw new Error("Service name is required.");
  }

  if (!SERVICE_ACCOUNT_STATUSES.some((serviceAccountStatus) => serviceAccountStatus === status)) {
    throw new Error("Service account status is not valid.");
  }

  if (!Number.isInteger(totalSlots) || totalSlots < 0) {
    throw new Error("Total slots must be a non-negative whole number.");
  }

  if (!Number.isInteger(usedSlots) || usedSlots < 0) {
    throw new Error("Used slots must be a non-negative whole number.");
  }

  if (usedSlots > totalSlots) {
    throw new Error("Used slots cannot exceed total slots.");
  }

  return {
    label,
    service_name: serviceName,
    account_identifier: emptyToNull(input.account_identifier),
    credential_reference: emptyToNull(input.credential_reference),
    total_slots: totalSlots,
    used_slots: usedSlots,
    status,
    renewal_date: emptyToNull(input.renewal_date),
    notes: emptyToNull(input.notes),
  };
}

function toMutationError(action: string, error: unknown): ServiceAccountMutationResult {
  console.error(action, error);

  return {
    ok: false,
    error: "Service account could not be saved right now.",
  };
}

export async function getServiceAccounts(filters: ServiceAccountFilters = {}): Promise<ServiceAccountsResult> {
  let query = supabase.from("service_accounts").select(
    "id,label,service_name,account_identifier,credential_reference,total_slots,used_slots,status,renewal_date,notes,created_at,updated_at",
  );

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const search = filters.q?.trim();

  if (search) {
    const escapedSearch = search.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(
      `label.ilike.%${escapedSearch}%,service_name.ilike.%${escapedSearch}%,account_identifier.ilike.%${escapedSearch}%,credential_reference.ilike.%${escapedSearch}%`,
    );
  }

  const { data, error } = await query
    .order("service_name", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    console.error("Failed to load service accounts", {
      code: error.code,
      message: error.message,
    });

    return {
      data: [],
      error: "Service account data could not be loaded right now.",
    };
  }

  return {
    data: data ?? [],
    error: null,
  };
}

export async function createServiceAccount(input: ServiceAccountFormInput): Promise<ServiceAccountMutationResult> {
  let payload: ServiceAccountInsert;

  try {
    payload = normalizeServiceAccountInput(input);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Service account data is not valid.",
    };
  }

  const { error } = await supabase.from("service_accounts").insert(payload);

  if (error) {
    return toMutationError("Failed to create service account", error);
  }

  return { ok: true, error: null };
}

export async function updateServiceAccount(
  id: string,
  input: ServiceAccountFormInput,
): Promise<ServiceAccountMutationResult> {
  let payload: ServiceAccountUpdate;

  try {
    payload = normalizeServiceAccountInput(input);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Service account data is not valid.",
    };
  }

  const { error } = await supabase.from("service_accounts").update(payload).eq("id", id);

  if (error) {
    return toMutationError("Failed to update service account", error);
  }

  return { ok: true, error: null };
}

export async function archiveServiceAccount(id: string): Promise<ServiceAccountMutationResult> {
  const { error } = await supabase.from("service_accounts").update({ status: "archived" }).eq("id", id);

  if (error) {
    return toMutationError("Failed to archive service account", error);
  }

  return { ok: true, error: null };
}

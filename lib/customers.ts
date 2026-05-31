import { CUSTOMER_STATUSES } from "@/lib/statuses";
import { supabase } from "@/lib/supabase";
import type { Customer, CustomerInsert, CustomerStatus, CustomerUpdate } from "@/types/database";

export type CustomersResult =
  | {
    data: Customer[];
    error: null;
  }
  | {
    data: [];
    error: string;
  };

export type CustomerFormInput = {
  name: string;
  contact_label?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: CustomerStatus;
  notes?: string | null;
};

export type CustomerMutationResult =
  | {
    ok: true;
    error: null;
  }
  | {
    ok: false;
    error: string;
  };

export type CustomerCreateResult =
  | {
    data: Customer;
    error: null;
  }
  | {
    data: null;
    error: string;
  };

export type CustomerFilters = {
  q?: string;
  status?: CustomerStatus | "all";
};

const customerSelect = "id,name,contact_label,phone,email,status,notes,created_at,updated_at";

function emptyToNull(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeCustomerInput(input: CustomerFormInput): CustomerInsert {
  const name = input.name.trim();
  const status = input.status ?? "active";

  if (!name) {
    throw new Error("Customer name is required.");
  }

  if (!CUSTOMER_STATUSES.some((customerStatus) => customerStatus === status)) {
    throw new Error("Customer status is not valid.");
  }

  return {
    name,
    contact_label: emptyToNull(input.contact_label),
    phone: emptyToNull(input.phone),
    email: emptyToNull(input.email),
    status,
    notes: emptyToNull(input.notes),
  };
}

function toMutationError(action: string, error: unknown): CustomerMutationResult {
  console.error(action, error);

  return {
    ok: false,
    error: "Customer could not be saved right now.",
  };
}

function toCreateError(action: string, error: unknown): CustomerCreateResult {
  console.error(action, error);

  return {
    data: null,
    error: "Customer could not be saved right now.",
  };
}

export async function getCustomers(filters: CustomerFilters = {}): Promise<CustomersResult> {
  let query = supabase.from("customers").select(customerSelect);

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const search = filters.q?.trim();

  if (search) {
    const escapedSearch = search.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(
      `name.ilike.%${escapedSearch}%,contact_label.ilike.%${escapedSearch}%,phone.ilike.%${escapedSearch}%,email.ilike.%${escapedSearch}%`,
    );
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) {
    console.error("Failed to load customers", {
      code: error.code,
      message: error.message,
    });

    return {
      data: [],
      error: "Customer data could not be loaded right now.",
    };
  }

  return {
    data: data ?? [],
    error: null,
  };
}

export async function createCustomer(input: CustomerFormInput): Promise<CustomerMutationResult> {
  const result = await createCustomerRecord(input);

  if (result.error) {
    return { ok: false, error: result.error };
  }

  return { ok: true, error: null };
}

export async function createCustomerRecord(input: CustomerFormInput): Promise<CustomerCreateResult> {
  let payload: CustomerInsert;

  try {
    payload = normalizeCustomerInput(input);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Customer data is not valid.",
    };
  }

  const { data, error } = await supabase.from("customers").insert(payload).select(customerSelect).single();

  if (error) {
    return toCreateError("Failed to create customer", error);
  }

  return { data, error: null };
}

export async function updateCustomer(id: string, input: CustomerFormInput): Promise<CustomerMutationResult> {
  let payload: CustomerUpdate;

  try {
    payload = normalizeCustomerInput(input);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Customer data is not valid.",
    };
  }

  const { error } = await supabase.from("customers").update(payload).eq("id", id);

  if (error) {
    return toMutationError("Failed to update customer", error);
  }

  return { ok: true, error: null };
}

export async function archiveCustomer(id: string): Promise<CustomerMutationResult> {
  const { error } = await supabase.from("customers").update({ status: "archived" }).eq("id", id);

  if (error) {
    return toMutationError("Failed to archive customer", error);
  }

  return { ok: true, error: null };
}

import { createCustomerRecord } from "@/lib/customers";
import { SUBSCRIPTION_STATUSES } from "@/lib/statuses";
import { supabase } from "@/lib/supabase";
import type {
  Customer,
  RentalPackage,
  ServiceAccount,
  ServiceAccountProfile,
  Subscription,
  SubscriptionInsert,
  SubscriptionStatus,
  SubscriptionUpdate,
  ServiceAccountProfileStatus,
} from "@/types/database";

type SubscriptionListRow = Subscription & {
  end_time: string | null;
  customers: Pick<Customer, "id" | "name" | "contact_label" | "phone"> | null;
  service_accounts: Pick<ServiceAccount, "id" | "label" | "service_name" | "account_identifier"> | null;
  service_account_profiles: Pick<ServiceAccountProfile, "id" | "profile_name" | "profile_pin"> | null;
  rental_packages: Pick<RentalPackage, "id" | "name"> | null;
};

export type SubscriptionListItem = Subscription & {
  end_time: string | null;
  customer: Pick<Customer, "id" | "name" | "contact_label" | "phone"> | null;
  serviceAccount: Pick<ServiceAccount, "id" | "label" | "service_name" | "account_identifier"> | null;
  profile: Pick<ServiceAccountProfile, "id" | "profile_name" | "profile_pin"> | null;
  rentalPackage: Pick<RentalPackage, "id" | "name"> | null;
};

export type SubscriptionsResult =
  | {
    data: SubscriptionListItem[];
    error: null;
  }
  | {
    data: [];
    error: string;
  };

export type SubscriptionFormOptionsResult =
  | {
    customers: Pick<Customer, "id" | "name" | "contact_label">[];
    serviceAccounts: Pick<ServiceAccount, "id" | "label" | "service_name">[];
    profiles: Pick<ServiceAccountProfile, "id" | "service_account_id" | "profile_name" | "profile_pin" | "status">[];
    rentalPackages: RentalPackage[];
    error: null;
  }
  | {
    customers: [];
    serviceAccounts: [];
    profiles: [];
    rentalPackages: [];
    error: string;
  };

export type SubscriptionFilters = {
  q?: string;
  status?: SubscriptionStatus | "all";
  service_account_id?: string | "all";
};

export type SubscriptionFormInput = {
  customer_mode?: "existing" | "new";
  customer_id?: string | null;
  new_customer_name?: string | null;
  new_customer_contact_label?: string | null;
  new_customer_phone?: string | null;
  new_customer_email?: string | null;
  new_customer_notes?: string | null;
  service_account_id: string;
  service_account_profile_id: string;
  rental_package_id: string;
  start_date: string;
  end_date?: string | null;
  price_snapshot?: string | number | null;
  end_time?: string | null;
  status?: SubscriptionStatus;
  notes?: string | null;
};

export type SubscriptionMutationResult =
  | {
    ok: true;
    error: null;
  }
  | {
    ok: false;
    error: string;
  };

function emptyToNull(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function parsePrice(value: string | number | null | undefined, fallback: number) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  return Number(value);
}

function addDays(dateValue: string, durationDays: number) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + durationDays);
  return date.toISOString().slice(0, 10);
}

async function getRentalPackageOrThrow(id: string) {
  const { data, error } = await supabase
    .from("rental_packages")
    .select("id,name,duration_days,default_price,status,notes,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data || data.status !== "active") {
    throw new Error("Rental package is not available.");
  }

  return data;
}

function validateBaseInput(input: SubscriptionFormInput) {
  const status = input.status ?? "booked";
  const startDate = emptyToNull(input.start_date);

  if (!input.service_account_id) {
    throw new Error("Service account is required.");
  }

  if (!input.service_account_profile_id) {
    throw new Error("Profile is required.");
  }

  if (!input.rental_package_id) {
    throw new Error("Rental package is required.");
  }

  if (!startDate) {
    throw new Error("Start date is required.");
  }

  if (!SUBSCRIPTION_STATUSES.some((subscriptionStatus) => subscriptionStatus === status)) {
    throw new Error("Booking status is not valid.");
  }

  return { status, startDate };
}

async function normalizeSubscriptionInput(input: SubscriptionFormInput, customerId: string): Promise<SubscriptionInsert> {
  const { status, startDate } = validateBaseInput(input);
  const rentalPackage = await getRentalPackageOrThrow(input.rental_package_id);
  const price = parsePrice(input.price_snapshot, rentalPackage.default_price);

  if (!Number.isInteger(price) || price < 0) {
    throw new Error("Price must be a non-negative whole number.");
  }

  return {
    customer_id: customerId,
    service_account_id: input.service_account_id,
    service_account_profile_id: input.service_account_profile_id,
    rental_package_id: rentalPackage.id,
    package_name_snapshot: rentalPackage.name,
    duration_days_snapshot: rentalPackage.duration_days,
    price_snapshot: price,
    start_date: startDate,
    end_date: emptyToNull(input.end_date) ?? addDays(startDate, rentalPackage.duration_days),
    end_time: emptyToNull(input.end_time) ?? "23:59:00",
    status,
    notes: emptyToNull(input.notes),
  };
}

function toMutationError(action: string, error: unknown): SubscriptionMutationResult {
  console.error(action, error);

  return {
    ok: false,
    error: error instanceof Error ? error.message : "Booking could not be saved right now.",
  };
}

function mapSubscriptionRow(row: SubscriptionListRow): SubscriptionListItem {
  return {
    ...row,
    customer: row.customers,
    serviceAccount: row.service_accounts,
    profile: row.service_account_profiles,
    rentalPackage: row.rental_packages,
  };
}

export async function getSubscriptionFormOptions(): Promise<SubscriptionFormOptionsResult> {
  const [customersResult, accountsResult, profilesResult, packagesResult] = await Promise.all([
    supabase
      .from("customers")
      .select("id,name,contact_label")
      .eq("status", "active")
      .order("name", { ascending: true }),
    supabase
      .from("service_accounts")
      .select("id,label,service_name")
      .in("status", ["active", "full"])
      .order("label", { ascending: true }),
    supabase
      .from("service_account_profiles")
      .select("id,service_account_id,profile_name,profile_pin,status")
      .eq("is_rentable", true)
      .neq("status", "archived")
      .order("profile_name", { ascending: true }),
    supabase
      .from("rental_packages")
      .select("id,name,duration_days,default_price,status,notes,created_at,updated_at")
      .eq("status", "active")
      .order("duration_days", { ascending: true }),
  ]);

  const error = customersResult.error || accountsResult.error || profilesResult.error || packagesResult.error;

  if (error) {
    console.error("Failed to load booking form options", error);
    return {
      customers: [],
      serviceAccounts: [],
      profiles: [],
      rentalPackages: [],
      error: "Booking form options could not be loaded right now.",
    };
  }

  return {
    customers: customersResult.data ?? [],
    serviceAccounts: accountsResult.data ?? [],
    profiles: profilesResult.data ?? [],
    rentalPackages: packagesResult.data ?? [],
    error: null,
  };
}

export async function getSubscriptions(filters: SubscriptionFilters = {}): Promise<SubscriptionsResult> {
  let query = supabase
    .from("subscriptions")
    .select(`
      id,customer_id,service_account_id,service_account_profile_id,rental_package_id,package_name_snapshot,duration_days_snapshot,price_snapshot,start_date,end_date,status,notes,created_at,updated_at,
      customers(id,name,contact_label,phone),
      service_accounts(id,label,service_name,account_identifier),
      service_account_profiles(id,profile_name,profile_pin),
      rental_packages(id,name)
    `);

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.service_account_id && filters.service_account_id !== "all") {
    query = query.eq("service_account_id", filters.service_account_id);
  }

  const { data, error } = await query.order("start_date", { ascending: false }).order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load bookings", error);
    return { data: [], error: "Booking data could not be loaded right now." };
  }

  const rows = (data ?? []) as unknown as SubscriptionListRow[];
  const search = filters.q?.trim().toLowerCase();
  const filteredRows = search
    ? rows.filter((row) => {
      const values = [
        row.customers?.name,
        row.customers?.contact_label,
        row.customers?.phone,
        row.service_accounts?.label,
        row.service_accounts?.service_name,
        row.service_accounts?.account_identifier,
        row.service_account_profiles?.profile_name,
        row.package_name_snapshot,
      ];

      return values.some((value) => value?.toLowerCase().includes(search));
    })
    : rows;

  return { data: filteredRows.map(mapSubscriptionRow), error: null };
}

async function syncProfileStatus(profileId: string): Promise<void> {
  try {
    const { data: activeBookings, error: checkError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("service_account_profile_id", profileId)
      .eq("status", "booked");

    if (checkError) {
      console.error("Failed to check active bookings for profile:", checkError);
      return;
    }

    const hasActiveBooking = (activeBookings ?? []).length > 0;
    const newStatus: ServiceAccountProfileStatus = hasActiveBooking ? "occupied" : "available";

    const { error: updateError } = await supabase
      .from("service_account_profiles")
      .update({ status: newStatus })
      .eq("id", profileId)
      .neq("status", "archived")
      .neq("status", newStatus);

    if (updateError) {
      console.error("Failed to sync profile status:", updateError);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("service_account_profiles")
      .select("service_account_id")
      .eq("id", profileId)
      .maybeSingle();

    if (profileError || !profileData) {
      console.error("Failed to get profile data for slot sync:", profileError);
      return;
    }

    const accountId = profileData.service_account_id;

    const { data: countData, error: countError } = await supabase
      .from("service_account_profiles")
      .select("id")
      .eq("service_account_id", accountId)
      .in("status", ["occupied", "reserved"]);

    if (countError) {
      console.error("Failed to count occupied profiles:", countError);
      return;
    }

    const usedSlots = (countData ?? []).length;

    const { error: accountUpdateError } = await supabase
      .from("service_accounts")
      .update({ used_slots: usedSlots })
      .eq("id", accountId);

    if (accountUpdateError) {
      console.error("Failed to update service account used slots:", accountUpdateError);
    }
  } catch (err) {
    console.error("Error in syncProfileStatus:", err);
  }
}

export async function createSubscription(input: SubscriptionFormInput): Promise<SubscriptionMutationResult> {
  try {
    let customerId = emptyToNull(input.customer_id);

    if (input.customer_mode === "new") {
      const customerResult = await createCustomerRecord({
        name: input.new_customer_name ?? "",
        contact_label: input.new_customer_contact_label,
        phone: input.new_customer_phone,
        email: input.new_customer_email,
        status: "active",
        notes: input.new_customer_notes,
      });

      if (customerResult.error || !customerResult.data) {
        return { ok: false, error: customerResult.error ?? "New customer could not be loaded." };
      }

      customerId = customerResult.data.id;
    }

    if (!customerId) {
      throw new Error("Customer is required.");
    }

    const payload = await normalizeSubscriptionInput(input, customerId);
    const { error } = await supabase.from("subscriptions").insert(payload);

    if (error) {
      return toMutationError("Failed to create booking", error);
    }

    await syncProfileStatus(payload.service_account_profile_id);

    return { ok: true, error: null };
  } catch (error) {
    return toMutationError("Failed to create booking", error);
  }
}

export async function updateSubscription(
  id: string,
  input: SubscriptionFormInput,
): Promise<SubscriptionMutationResult> {
  try {
    const customerId = emptyToNull(input.customer_id);

    if (!customerId) {
      throw new Error("Customer is required.");
    }

    const { data: oldBooking, error: loadError } = await supabase
      .from("subscriptions")
      .select("service_account_profile_id")
      .eq("id", id)
      .maybeSingle();

    if (loadError) {
      return { ok: false, error: "Failed to retrieve existing booking." };
    }

    const payload: SubscriptionUpdate = await normalizeSubscriptionInput(input, customerId);
    const { error } = await supabase.from("subscriptions").update(payload).eq("id", id);

    if (error) {
      return toMutationError("Failed to update booking", error);
    }

    if (payload.service_account_profile_id) {
      await syncProfileStatus(payload.service_account_profile_id);
    }
    if (oldBooking?.service_account_profile_id && oldBooking.service_account_profile_id !== payload.service_account_profile_id) {
      await syncProfileStatus(oldBooking.service_account_profile_id);
    }

    return { ok: true, error: null };
  } catch (error) {
    return toMutationError("Failed to update booking", error);
  }
}

export async function archiveSubscription(id: string): Promise<SubscriptionMutationResult> {
  const { data: booking, error: loadError } = await supabase
    .from("subscriptions")
    .select("service_account_profile_id")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return { ok: false, error: "Failed to retrieve booking before archive." };
  }

  const { error } = await supabase.from("subscriptions").update({ status: "archived" }).eq("id", id);

  if (error) {
    return toMutationError("Failed to archive booking", error);
  }

  if (booking?.service_account_profile_id) {
    await syncProfileStatus(booking.service_account_profile_id);
  }

  return { ok: true, error: null };
}

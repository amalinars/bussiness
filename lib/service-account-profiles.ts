import { SERVICE_ACCOUNT_PROFILE_STATUSES } from "@/lib/statuses";
import { supabase } from "@/lib/supabase";
import type {
  ServiceAccount,
  ServiceAccountProfile,
  ServiceAccountProfileInsert,
  ServiceAccountProfileStatus,
} from "@/types/database";

const MAX_PROFILES_PER_ACCOUNT = 5;
const MAX_RENTABLE_PROFILES_PER_ACCOUNT = 4;

export type ServiceAccountWithProfilesResult =
  | {
    account: ServiceAccount;
    profiles: ServiceAccountProfile[];
    error: null;
  }
  | {
    account: null;
    profiles: [];
    error: string;
  };

export type ServiceAccountProfileFormInput = {
  profile_name: string;
  profile_pin?: string | null;
  is_rentable?: boolean | string | null;
  status?: ServiceAccountProfileStatus;
  notes?: string | null;
};

export type ServiceAccountProfileMutationResult =
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

function normalizeBoolean(value: boolean | string | null | undefined) {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "on" || value === "true";
}

function normalizeProfileInput(input: ServiceAccountProfileFormInput): Omit<ServiceAccountProfileInsert, "service_account_id"> {
  const profileName = input.profile_name.trim();
  const status = input.status ?? "available";

  if (!profileName) {
    throw new Error("Profile name is required.");
  }

  if (!SERVICE_ACCOUNT_PROFILE_STATUSES.some((profileStatus) => profileStatus === status)) {
    throw new Error("Profile status is not valid.");
  }

  return {
    profile_name: profileName,
    profile_pin: emptyToNull(input.profile_pin),
    is_rentable: normalizeBoolean(input.is_rentable),
    status,
    notes: emptyToNull(input.notes),
  };
}

async function getExistingProfiles(serviceAccountId: string) {
  const { data, error } = await supabase
    .from("service_account_profiles")
    .select("id,is_rentable,status")
    .eq("service_account_id", serviceAccountId);

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function assertProfileLimits(
  serviceAccountId: string,
  payload: Omit<ServiceAccountProfileInsert, "service_account_id">,
  currentProfileId?: string,
) {
  const profiles = await getExistingProfiles(serviceAccountId);
  const activeProfiles = profiles.filter((profile) => profile.status !== "archived" && profile.id !== currentProfileId);
  const activeRentableProfiles = activeProfiles.filter((profile) => profile.is_rentable);
  const nextIsArchived = payload.status === "archived";
  const nextActiveCount = activeProfiles.length + (nextIsArchived ? 0 : 1);
  const nextRentableCount = activeRentableProfiles.length + (!nextIsArchived && payload.is_rentable ? 1 : 0);

  if (nextActiveCount > MAX_PROFILES_PER_ACCOUNT) {
    throw new Error("A service account can only have up to 5 active profiles.");
  }

  if (nextRentableCount > MAX_RENTABLE_PROFILES_PER_ACCOUNT) {
    throw new Error("Only 4 profiles can be marked rentable for one service account.");
  }
}

function toMutationError(action: string, error: unknown): ServiceAccountProfileMutationResult {
  console.error(action, error);

  return {
    ok: false,
    error: error instanceof Error ? error.message : "Service account profile could not be saved right now.",
  };
}

export async function getServiceAccountWithProfiles(serviceAccountId: string): Promise<ServiceAccountWithProfilesResult> {
  const [accountResult, profilesResult] = await Promise.all([
    supabase
      .from("service_accounts")
      .select("id,label,service_name,account_identifier,account_password,credential_reference,total_slots,used_slots,status,renewal_date,notes,created_at,updated_at")
      .eq("id", serviceAccountId)
      .maybeSingle(),
    supabase
      .from("service_account_profiles")
      .select("id,service_account_id,profile_name,profile_pin,is_rentable,status,notes,created_at,updated_at")
      .eq("service_account_id", serviceAccountId)
      .order("created_at", { ascending: true }),
  ]);

  if (accountResult.error) {
    console.error("Failed to load service account", accountResult.error);
    return { account: null, profiles: [], error: "Service account could not be loaded right now." };
  }

  if (!accountResult.data) {
    return { account: null, profiles: [], error: "Service account was not found." };
  }

  if (profilesResult.error) {
    console.error("Failed to load service account profiles", profilesResult.error);
    return { account: null, profiles: [], error: "Service account profiles could not be loaded right now." };
  }

  return {
    account: accountResult.data,
    profiles: profilesResult.data ?? [],
    error: null,
  };
}

export async function createServiceAccountProfile(
  serviceAccountId: string,
  input: ServiceAccountProfileFormInput,
): Promise<ServiceAccountProfileMutationResult> {
  try {
    const payload = normalizeProfileInput(input);
    await assertProfileLimits(serviceAccountId, payload);

    const { error } = await supabase.from("service_account_profiles").insert({
      ...payload,
      service_account_id: serviceAccountId,
    });

    if (error) {
      return toMutationError("Failed to create service account profile", error);
    }

    return { ok: true, error: null };
  } catch (error) {
    return toMutationError("Failed to create service account profile", error);
  }
}

export async function updateServiceAccountProfile(
  serviceAccountId: string,
  profileId: string,
  input: ServiceAccountProfileFormInput,
): Promise<ServiceAccountProfileMutationResult> {
  try {
    const payload = normalizeProfileInput(input);
    await assertProfileLimits(serviceAccountId, payload, profileId);

    const { error } = await supabase.from("service_account_profiles").update(payload).eq("id", profileId);

    if (error) {
      return toMutationError("Failed to update service account profile", error);
    }

    return { ok: true, error: null };
  } catch (error) {
    return toMutationError("Failed to update service account profile", error);
  }
}

export async function archiveServiceAccountProfile(profileId: string): Promise<ServiceAccountProfileMutationResult> {
  const { error } = await supabase.from("service_account_profiles").update({ status: "archived" }).eq("id", profileId);

  if (error) {
    return toMutationError("Failed to archive service account profile", error);
  }

  return { ok: true, error: null };
}

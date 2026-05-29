import { supabase } from "@/lib/supabase";
import type { ServiceAccount } from "@/types/database";

export type ServiceAccountsResult =
  | {
    data: ServiceAccount[];
    error: null;
  }
  | {
    data: [];
    error: string;
  };

export async function getServiceAccounts(): Promise<ServiceAccountsResult> {
  const { data, error } = await supabase
    .from("service_accounts")
    .select(
      "id,label,service_name,account_identifier,credential_reference,total_slots,used_slots,status,renewal_date,notes,created_at,updated_at",
    )
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

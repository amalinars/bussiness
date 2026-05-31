import { supabase } from "@/lib/supabase";
import type { RentalPackage } from "@/types/database";

export type RentalPackagesResult =
  | {
    data: RentalPackage[];
    error: null;
  }
  | {
    data: [];
    error: string;
  };

export async function getRentalPackages(): Promise<RentalPackagesResult> {
  const { data, error } = await supabase
    .from("rental_packages")
    .select("id,name,duration_days,default_price,status,notes,created_at,updated_at")
    .eq("status", "active")
    .order("duration_days", { ascending: true });

  if (error) {
    console.error("Failed to load rental packages", error);
    return { data: [], error: "Rental package data could not be loaded right now." };
  }

  return { data: data ?? [], error: null };
}

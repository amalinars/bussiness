import { supabase } from "@/lib/supabase";

export async function getDashboardData() {
  const [
    { count: customerCount },
    { data: activeAccounts },
    { data: maintenanceAccounts },
    { data: accountsData },
    { data: recentCustomers },
    { data: recentAccounts },
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .neq("status", "archived"),
    supabase
      .from("service_accounts")
      .select("*", { count: "exact", head: true })
      .in("status", ["active", "full"]),
    supabase
      .from("service_accounts")
      .select("*", { count: "exact", head: true })
      .in("status", ["maintenance", "inactive"]),
    supabase
      .from("service_accounts")
      .select("total_slots,used_slots")
      .neq("status", "archived"),
    supabase
      .from("customers")
      .select("id,name,created_at,status")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("service_accounts")
      .select("id,label,created_at,status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalSlots = accountsData?.reduce((acc, curr) => acc + (curr.total_slots || 0), 0) || 0;
  const usedSlots = accountsData?.reduce((acc, curr) => acc + (curr.used_slots || 0), 0) || 0;
  const availableSlots = Math.max(0, totalSlots - usedSlots);

  const recentActivity = [
    ...(recentCustomers?.map((c) => ({
      id: c.id,
      type: "Customer",
      label: c.name,
      status: c.status,
      date: new Date(c.created_at),
    })) || []),
    ...(recentAccounts?.map((a) => ({
      id: a.id,
      type: "Service Account",
      label: a.label,
      status: a.status,
      date: new Date(a.created_at),
    })) || []),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return {
    customerCount: customerCount || 0,
    activeAccountsCount: activeAccounts?.length || 0,
    maintenanceAccountsCount: maintenanceAccounts?.length || 0,
    availableSlots,
    recentActivity,
  };
}

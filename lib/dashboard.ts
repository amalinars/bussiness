import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const [customersRes, accountsRes] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("service_accounts").select("total_slots, used_slots, status"),
  ]);

  const totalCustomers = customersRes.count || 0;
  const accounts = accountsRes.data || [];
  
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(a => a.status === 'active').length;
  
  const totalSlots = accounts.reduce((acc, curr) => acc + (curr.total_slots || 0), 0);
  const usedSlots = accounts.reduce((acc, curr) => acc + (curr.used_slots || 0), 0);
  const availableSlots = totalSlots - usedSlots;

  return {
    totalCustomers,
    totalAccounts,
    activeAccounts,
    availableSlots,
    totalSlots
  };
}

export async function getRecentActivity() {
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    recentCustomers: customers || [],
  };
}

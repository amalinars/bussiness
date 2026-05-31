import { supabase } from "@/lib/supabase";
import type { ServiceAccount, Subscription } from "@/types/database";

type DashboardSubscriptionRow = Pick<
  Subscription,
  | "id"
  | "service_account_id"
  | "service_account_profile_id"
  | "package_name_snapshot"
  | "duration_days_snapshot"
  | "price_snapshot"
  | "start_date"
  | "end_date"
  | "status"
> & {
  customers: { name: string } | null;
  service_accounts: Pick<ServiceAccount, "id" | "label" | "service_name"> | null;
  service_account_profiles: { profile_name: string; profile_pin: string | null } | null;
};

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateOnly(dateValue: string) {
  return new Date(`${dateValue}T00:00:00.000Z`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export async function getDashboardData() {
  const today = new Date();
  const todayDate = toDateOnly(today);
  const endingSoonLimit = new Date(today);
  endingSoonLimit.setDate(today.getDate() + 3);
  const endingSoonDate = toDateOnly(endingSoonLimit);

  const [
    { count: customerCount },
    { data: activeAccounts },
    { data: maintenanceAccounts },
    { data: accountsData },
    { data: recentCustomers },
    { data: recentAccounts },
    { data: subscriptionsData },
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
    supabase
      .from("subscriptions")
      .select(`
        id,service_account_id,service_account_profile_id,package_name_snapshot,duration_days_snapshot,price_snapshot,start_date,end_date,status,
        customers(name),
        service_accounts(id,label,service_name),
        service_account_profiles(profile_name,profile_pin)
      `)
      .neq("status", "archived"),
  ]);

  const totalSlots = accountsData?.reduce((acc, curr) => acc + (curr.total_slots || 0), 0) || 0;
  const usedSlots = accountsData?.reduce((acc, curr) => acc + (curr.used_slots || 0), 0) || 0;
  const availableSlots = Math.max(0, totalSlots - usedSlots);
  const subscriptions = (subscriptionsData ?? []) as unknown as DashboardSubscriptionRow[];
  const countedSubscriptions = subscriptions.filter((subscription) => subscription.status === "booked" || subscription.status === "completed");
  const activeBookingsCount = subscriptions.filter((subscription) => subscription.status === "booked").length;
  const completedBookingsCount = subscriptions.filter((subscription) => subscription.status === "completed").length;
  const bookingValue = countedSubscriptions.reduce((acc, subscription) => acc + subscription.price_snapshot, 0);
  const endingSoonBookings = subscriptions
    .filter(
      (subscription) =>
        subscription.status === "booked" &&
        subscription.end_date >= todayDate &&
        subscription.end_date <= endingSoonDate,
    )
    .sort((a, b) => a.end_date.localeCompare(b.end_date))
    .slice(0, 5)
    .map((subscription) => ({
      id: subscription.id,
      customerName: subscription.customers?.name ?? "Unknown customer",
      accountLabel: subscription.service_accounts?.label ?? "Unknown account",
      profileName: subscription.service_account_profiles?.profile_name ?? "Unknown profile",
      profilePin: subscription.service_account_profiles?.profile_pin,
      packageName: subscription.package_name_snapshot,
      endDate: subscription.end_date,
      endDateLabel: formatDateOnly(subscription.end_date),
    }));

  const bookingByServiceAccount = Array.from(
    countedSubscriptions.reduce(
      (acc, subscription) => {
        const accountId = subscription.service_account_id;
        const existing = acc.get(accountId) ?? {
          id: accountId,
          label: subscription.service_accounts?.label ?? "Unknown account",
          serviceName: subscription.service_accounts?.service_name ?? "Unknown service",
          totalBookings: 0,
          activeBookings: 0,
          completedBookings: 0,
          bookingValue: 0,
        };

        existing.totalBookings += 1;
        existing.bookingValue += subscription.price_snapshot;

        if (subscription.status === "booked") {
          existing.activeBookings += 1;
        }

        if (subscription.status === "completed") {
          existing.completedBookings += 1;
        }

        acc.set(accountId, existing);
        return acc;
      },
      new Map<
        string,
        {
          id: string;
          label: string;
          serviceName: string;
          totalBookings: number;
          activeBookings: number;
          completedBookings: number;
          bookingValue: number;
        }
      >(),
    ).values(),
  ).sort((a, b) => b.totalBookings - a.totalBookings);

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
    activeBookingsCount,
    completedBookingsCount,
    bookingValue,
    endingSoonCount: endingSoonBookings.length,
    endingSoonBookings,
    bookingByServiceAccount,
    recentActivity,
  };
}

import { connection } from "next/server";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceAccounts } from "@/lib/service-accounts";

import { ServiceAccountActions } from "./ServiceAccountActions";
import { ServiceAccountFilters } from "./ServiceAccountFilters";
import { ServiceAccountFormDialog } from "./ServiceAccountFormDialog";

const serviceAccountStatusTone = {
  active: "active",
  full: "warning",
  maintenance: "info",
  inactive: "neutral",
  archived: "neutral",
} as const;

type ServiceAccountsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function ServiceAccountsPage({ searchParams }: ServiceAccountsPageProps) {
  await connection();

  const params = await searchParams;
  const status = serviceAccountStatusTone[params.status as keyof typeof serviceAccountStatusTone] ? params.status : "all";
  const filters = {
    q: params.q ?? "",
    status: status as keyof typeof serviceAccountStatusTone | "all",
  };
  const hasFilters = Boolean(filters.q || filters.status !== "all");

  const { data: serviceAccounts, error } = await getServiceAccounts(filters);

  return (
    <PageContainer
      title="Service Accounts"
      eyebrow="Active MVP module"
      description="Service account inventory from the initial Supabase database foundation."
    >
      <ServiceAccountFilters q={filters.q} status={filters.status} />
      {error ? (
        <EmptyState title="Service account data unavailable" description={error} />
      ) : serviceAccounts.length === 0 ? (
        <div className="space-y-4">
          <ServiceAccountFormDialog />
          <EmptyState
            title={hasFilters ? "No matching service accounts" : "No service accounts yet"}
            description={
              hasFilters
                ? "Try a different search or status filter."
                : "The service_accounts table is connected. Add the first service account to start managing slot capacity."
            }
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <CardTitle>Service account list</CardTitle>
              <CardDescription>
                {serviceAccounts.length} {hasFilters ? "matching" : "total"} service account records loaded from Supabase.
              </CardDescription>
            </div>
            <ServiceAccountFormDialog />
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto rounded-base border-2 border-border">
              <table className="w-full border-collapse text-left text-sm font-base">
                <thead className="bg-secondary-background">
                  <tr className="border-b-2 border-border">
                    <th className="px-4 py-3 font-heading">Account</th>
                    <th className="px-4 py-3 font-heading">Service</th>
                    <th className="px-4 py-3 font-heading">Slots</th>
                    <th className="px-4 py-3 font-heading">Renewal</th>
                    <th className="px-4 py-3 font-heading">Status</th>
                    <th className="px-4 py-3 font-heading">Credential Ref</th>
                    <th className="px-4 py-3 font-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceAccounts.map((account) => {
                    const availableSlots = account.total_slots - account.used_slots;

                    return (
                      <tr key={account.id} className="border-b-2 border-border last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="font-heading">{account.label}</div>
                          <div className="text-xs">{account.account_identifier ?? "No identifier"}</div>
                        </td>
                        <td className="px-4 py-3">{account.service_name}</td>
                        <td className="px-4 py-3">
                          <div>
                            {account.used_slots}/{account.total_slots} used
                          </div>
                          <div className="text-xs">{availableSlots} available</div>
                        </td>
                        <td className="px-4 py-3">{account.renewal_date ?? "-"}</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={serviceAccountStatusTone[account.status]}>{account.status}</StatusBadge>
                        </td>
                        <td className="px-4 py-3">{account.credential_reference ?? "-"}</td>
                        <td className="px-4 py-3">
                          <ServiceAccountActions account={account} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

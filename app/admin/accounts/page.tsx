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
      eyebrow="Accounts"
      description="Manage service accounts, credentials, renewals, and slot capacity."
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
                : "Add the first service account to start managing slot capacity."
            }
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="grid gap-3 px-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl">Service account list</CardTitle>
              <CardDescription className="wrap-break-word">
                {serviceAccounts.length} {hasFilters ? "matching" : "total"} service account records found.
              </CardDescription>
            </div>
            <ServiceAccountFormDialog />
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid gap-3 md:hidden">
              {serviceAccounts.map((account) => {
                const availableSlots = account.total_slots - account.used_slots;

                return (
                  <div key={account.id} className="min-w-0 space-y-3 rounded-base border-2 border-border bg-background p-3 shadow-shadow">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="wrap-break-word font-heading font-bold">{account.label}</p>
                        <p className="wrap-break-word text-xs font-base text-muted-foreground">{account.service_name}</p>
                      </div>
                      <StatusBadge tone={serviceAccountStatusTone[account.status]}>{account.status}</StatusBadge>
                    </div>

                    <div className="grid gap-2 text-sm font-base">
                      <div className="rounded-base border border-border bg-secondary-background p-2">
                        <p className="text-xs text-muted-foreground">Identifier</p>
                        <p className="wrap-break-word">{account.account_identifier ?? "No identifier"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Password</p>
                        <p className="wrap-break-word">{account.account_password ?? "-"}</p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-base border border-border bg-secondary-background p-2">
                          <p className="text-xs text-muted-foreground">Slots</p>
                          <p className="font-heading font-bold">{account.used_slots}/{account.total_slots} used</p>
                          <p className="text-xs">{availableSlots} available</p>
                        </div>
                        <div className="rounded-base border border-border bg-secondary-background p-2">
                          <p className="text-xs text-muted-foreground">Renewal</p>
                          <p>{account.renewal_date ?? "-"}</p>
                        </div>
                      </div>
                      <div className="rounded-base border border-border bg-secondary-background p-2">
                        <p className="text-xs text-muted-foreground">Credential Ref</p>
                        <p className="wrap-break-word">{account.credential_reference ?? "-"}</p>
                      </div>
                    </div>

                    <ServiceAccountActions account={account} />
                  </div>
                );
              })}
            </div>

            <div className="hidden w-full overflow-x-auto rounded-base border-2 border-border md:block">
              <table className="min-w-[900px] w-full border-collapse text-left text-sm font-base">
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
                        <td className="px-4 py-3 align-top">
                          <div className="font-heading">{account.label}</div>
                          <div className="text-xs">{account.account_identifier ?? "No identifier"}</div>
                          <div className="text-xs">Password: {account.account_password ?? "-"}</div>
                        </td>
                        <td className="px-4 py-3 align-top">{account.service_name}</td>
                        <td className="px-4 py-3 align-top">
                          <div>
                            {account.used_slots}/{account.total_slots} used
                          </div>
                          <div className="text-xs">{availableSlots} available</div>
                        </td>
                        <td className="px-4 py-3 align-top">{account.renewal_date ?? "-"}</td>
                        <td className="px-4 py-3 align-top">
                          <StatusBadge tone={serviceAccountStatusTone[account.status]}>{account.status}</StatusBadge>
                        </td>
                        <td className="max-w-xs px-4 py-3 align-top wrap-break-word">{account.credential_reference ?? "-"}</td>
                        <td className="px-4 py-3 align-top">
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

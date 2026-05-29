import { connection } from "next/server";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceAccounts } from "@/lib/service-accounts";

const serviceAccountStatusTone = {
  active: "active",
  full: "warning",
  maintenance: "info",
  inactive: "neutral",
  archived: "neutral",
} as const;

export default async function ServiceAccountsPage() {
  await connection();

  const { data: serviceAccounts, error } = await getServiceAccounts();

  return (
    <PageContainer
      title="Service Accounts"
      eyebrow="Active MVP module"
      description="Service account inventory from the initial Supabase database foundation."
    >
      {error ? (
        <EmptyState title="Service account data unavailable" description={error} />
      ) : serviceAccounts.length === 0 ? (
        <EmptyState
          title="No service accounts yet"
          description="The service_accounts table is connected, but no account records are available yet. CRUD is intentionally not implemented in this phase."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Service account list</CardTitle>
            <CardDescription>{serviceAccounts.length} service account records loaded from Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-base border-2 border-border">
              <table className="w-full border-collapse text-left text-sm font-base">
                <thead className="bg-secondary-background">
                  <tr className="border-b-2 border-border">
                    <th className="px-4 py-3 font-heading">Account</th>
                    <th className="px-4 py-3 font-heading">Service</th>
                    <th className="px-4 py-3 font-heading">Slots</th>
                    <th className="px-4 py-3 font-heading">Renewal</th>
                    <th className="px-4 py-3 font-heading">Status</th>
                    <th className="px-4 py-3 font-heading">Credential Ref</th>
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

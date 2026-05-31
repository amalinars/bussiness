import Link from "next/link";
import { connection } from "next/server";

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceAccountWithProfiles } from "@/lib/service-account-profiles";

import { ServiceAccountProfileActions } from "./ServiceAccountProfileActions";
import { ServiceAccountProfileFormDialog } from "./ServiceAccountProfileFormDialog";

const profileStatusTone = {
  available: "active",
  occupied: "warning",
  reserved: "info",
  maintenance: "info",
  archived: "neutral",
} as const;

type ServiceAccountDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ServiceAccountDetailPage({ params }: ServiceAccountDetailPageProps) {
  await connection();

  const { id } = await params;
  const { account, profiles, error } = await getServiceAccountWithProfiles(id);

  if (error || !account) {
    return (
      <PageContainer title="Service Account" eyebrow="Profiles" description="Manage profiles attached to this service account.">
        <EmptyState title="Service account unavailable" description={error ?? "Service account could not be loaded."} />
        <Button asChild variant="neutral">
          <Link href="/admin/accounts">Back to accounts</Link>
        </Button>
      </PageContainer>
    );
  }

  const activeProfiles = profiles.filter((profile) => profile.status !== "archived");
  const rentableProfiles = activeProfiles.filter((profile) => profile.is_rentable);

  return (
    <PageContainer
      title={account.label}
      eyebrow="Service Account Profiles"
      description="Manage profile names, PINs, rental availability, and status for this service account."
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="neutral">
          <Link href="/admin/accounts">Back to accounts</Link>
        </Button>
        <ServiceAccountProfileFormDialog serviceAccountId={account.id} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="bg-secondary-background">
          <CardHeader>
            <CardTitle className="text-xl font-heading font-black">Account summary</CardTitle>
            <CardDescription>{account.service_name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm font-base">
            <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
              <div className="font-heading">Identifier</div>
              <div>{account.account_identifier ?? "No identifier"}</div>
            </div>
            <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
              <div className="font-heading">Password</div>
              <div>{account.account_password ?? "-"}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
                <div className="font-heading">Profiles</div>
                <div>{activeProfiles.length}/5 active</div>
              </div>
              <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
                <div className="font-heading">Rentable</div>
                <div>{rentableProfiles.length}/4 disewakan</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-background">
          <CardHeader className="gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <CardTitle className="text-xl font-heading font-black">Profiles</CardTitle>
              <CardDescription>{profiles.length} profile records loaded.</CardDescription>
            </div>
            <ServiceAccountProfileFormDialog serviceAccountId={account.id} />
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <EmptyState title="No profiles yet" description="Add up to 5 profiles. Only 4 can be marked rentable." />
            ) : (
              <div className="w-full overflow-x-auto rounded-base border-2 border-border">
                <table className="w-full border-collapse text-left text-sm font-base">
                  <thead className="bg-secondary-background">
                    <tr className="border-b-2 border-border">
                      <th className="px-4 py-3 font-heading">Profile</th>
                      <th className="px-4 py-3 font-heading">PIN</th>
                      <th className="px-4 py-3 font-heading">Rentable</th>
                      <th className="px-4 py-3 font-heading">Status</th>
                      <th className="px-4 py-3 font-heading">Notes</th>
                      <th className="px-4 py-3 font-heading">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="border-b-2 border-border last:border-b-0">
                        <td className="px-4 py-3 font-heading">{profile.profile_name}</td>
                        <td className="px-4 py-3">{profile.profile_pin ?? "-"}</td>
                        <td className="px-4 py-3">{profile.is_rentable ? "Yes" : "No"}</td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={profileStatusTone[profile.status]}>{profile.status}</StatusBadge>
                        </td>
                        <td className="px-4 py-3">{profile.notes ?? "-"}</td>
                        <td className="px-4 py-3">
                          <ServiceAccountProfileActions serviceAccountId={account.id} profile={profile} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

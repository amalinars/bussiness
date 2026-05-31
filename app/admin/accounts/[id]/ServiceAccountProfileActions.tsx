"use client";

import { Button } from "@/components/ui/button";
import type { ServiceAccountProfile } from "@/types/database";

import { archiveServiceAccountProfileAction } from "./actions";
import { ServiceAccountProfileFormDialog } from "./ServiceAccountProfileFormDialog";

type ServiceAccountProfileActionsProps = {
  serviceAccountId: string;
  profile: ServiceAccountProfile;
};

export function ServiceAccountProfileActions({ serviceAccountId, profile }: ServiceAccountProfileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ServiceAccountProfileFormDialog serviceAccountId={serviceAccountId} profile={profile} />
      <form
        action={archiveServiceAccountProfileAction}
        onSubmit={(event) => {
          if (!confirm(`Archive ${profile.profile_name}?`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="service_account_id" value={serviceAccountId} />
        <input type="hidden" name="profile_id" value={profile.id} />
        <Button type="submit" size="sm" variant="neutral" disabled={profile.status === "archived"}>
          Archive
        </Button>
      </form>
    </div>
  );
}

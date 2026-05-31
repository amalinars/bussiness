"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SERVICE_ACCOUNT_PROFILE_STATUSES } from "@/lib/statuses";
import type { ServiceAccountProfile } from "@/types/database";

import {
  createServiceAccountProfileAction,
  updateServiceAccountProfileAction,
  type ServiceAccountProfileActionState,
} from "./actions";

const initialState: ServiceAccountProfileActionState = {
  ok: false,
  error: null,
};

type ServiceAccountProfileFormDialogProps = {
  serviceAccountId: string;
  profile?: ServiceAccountProfile;
};

export function ServiceAccountProfileFormDialog({ serviceAccountId, profile }: ServiceAccountProfileFormDialogProps) {
  const [open, setOpen] = useState(false);
  const action = profile ? updateServiceAccountProfileAction : createServiceAccountProfileAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  async function submitAction(formData: FormData) {
    await formAction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={profile ? "sm" : "default"} variant={profile ? "neutral" : "default"}>
          {profile ? "Edit" : "Add profile"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">{profile ? "Edit profile" : "Add profile"}</DialogTitle>
          <DialogDescription>Manage visible profile name, PIN, rental toggle, and status.</DialogDescription>
        </DialogHeader>

        <form action={submitAction} className="space-y-5">
          <input type="hidden" name="service_account_id" value={serviceAccountId} />
          {profile ? <input type="hidden" name="profile_id" value={profile.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-heading">
              Profile name
              <input
                required
                name="profile_name"
                defaultValue={profile?.profile_name ?? ""}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Profile PIN
              <input
                name="profile_pin"
                defaultValue={profile?.profile_pin ?? ""}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
            <label className="space-y-1 text-sm font-heading">
              Status
              <select
                name="status"
                defaultValue={profile?.status ?? "available"}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              >
                {SERVICE_ACCOUNT_PROFILE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-base border-2 border-border bg-secondary-background px-3 py-2 text-sm font-heading">
              <input
                type="checkbox"
                name="is_rentable"
                defaultChecked={profile?.is_rentable ?? true}
                className="size-4 accent-black"
              />
              Disewakan
            </label>
            <label className="space-y-1 text-sm font-heading sm:col-span-2">
              Notes
              <textarea
                name="notes"
                defaultValue={profile?.notes ?? ""}
                rows={3}
                className="w-full rounded-base border-2 border-border bg-secondary-background px-3 py-2 font-base outline-none focus:ring-2 focus:ring-border"
              />
            </label>
          </div>

          {state.error ? (
            <p className="rounded-base border-2 border-border bg-main px-3 py-2 text-sm font-heading">{state.error}</p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

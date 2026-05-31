"use client";

import { PendingSubmitButton } from "@/components/PendingSubmitButton";
import type { ServiceAccountCost } from "@/types/database";

import { cancelServiceAccountCostAction } from "./cost-actions";
import { ServiceAccountCostFormDialog } from "./ServiceAccountCostFormDialog";

type ServiceAccountCostActionsProps = {
  serviceAccountId: string;
  cost: ServiceAccountCost;
};

export function ServiceAccountCostActions({ serviceAccountId, cost }: ServiceAccountCostActionsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <ServiceAccountCostFormDialog serviceAccountId={serviceAccountId} cost={cost} />
      <form
        className="w-full sm:w-auto"
        action={cancelServiceAccountCostAction}
        onSubmit={(event) => {
          if (!confirm(`Cancel cost record Rp ${cost.amount.toLocaleString("id-ID")}?`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="service_account_id" value={serviceAccountId} />
        <input type="hidden" name="cost_id" value={cost.id} />
        <PendingSubmitButton idleLabel="Cancel" pendingLabel="Cancelling..." size="sm" variant="neutral" className="w-full sm:w-auto" disabled={cost.status === "cancelled"}>
          Cancel
        </PendingSubmitButton>
      </form>
    </div>
  );
}

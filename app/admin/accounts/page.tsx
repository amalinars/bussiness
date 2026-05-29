import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";

export default function ServiceAccountsPage() {
  return (
    <PageContainer
      title="Service Accounts"
      eyebrow="Active MVP module"
      description="Prepare the service account workspace for account inventory, slot capacity, and safe credential metadata."
    >
      <EmptyState
        title="Service account workspace ready"
        description="The page shell is available. Account inventory and slot tracking will be added after database planning."
      >
        <div className="grid gap-3 text-sm font-base sm:grid-cols-3">
          <div className="rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow">
            <StatusBadge tone="active">Planned</StatusBadge>
            <p className="mt-2">Account list and service label.</p>
          </div>
          <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
            <StatusBadge tone="warning">Planned</StatusBadge>
            <p className="mt-2">Slot capacity and availability status.</p>
          </div>
          <div className="rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow">
            <StatusBadge tone="info">Required</StatusBadge>
            <p className="mt-2">No plain-text password storage.</p>
          </div>
        </div>
      </EmptyState>
    </PageContainer>
  );
}

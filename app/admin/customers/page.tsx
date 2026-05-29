import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";

export default function CustomersPage() {
  return (
    <PageContainer
      title="Customers"
      eyebrow="Active MVP module"
      description="Prepare the customer workspace for names, contact references, notes, and future service account relationships."
    >
      <EmptyState
        title="Customer workspace ready"
        description="The page shell is available. Customer data entry, search, and detail views will be added after database planning."
      >
        <div className="grid gap-3 text-sm font-base sm:grid-cols-3">
          <div className="rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow">
            <StatusBadge tone="active">Planned</StatusBadge>
            <p className="mt-2">Customer list and profile summary.</p>
          </div>
          <div className="rounded-base border-2 border-border bg-background p-3 shadow-shadow">
            <StatusBadge tone="warning">Planned</StatusBadge>
            <p className="mt-2">Search and simple status filtering.</p>
          </div>
          <div className="rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow">
            <StatusBadge tone="info">Later</StatusBadge>
            <p className="mt-2">Subscription and payment history links.</p>
          </div>
        </div>
      </EmptyState>
    </PageContainer>
  );
}

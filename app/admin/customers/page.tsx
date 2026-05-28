import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";

export default function CustomersPage() {
  return (
    <PageContainer
      title="Customers"
      description="Manage customer identities, contact details, and subscription ownership."
    >
      <EmptyState
        title="Customer management is coming later"
        description="Customer listing, detail views, and lifecycle actions will be implemented in a future iteration."
      />
    </PageContainer>
  );
}

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";

export default function SubscriptionsPage() {
  return (
    <PageContainer
      title="Subscriptions"
      description="Track subscription slots, customer assignments, active periods, and expiration dates."
    >
      <EmptyState
        title="Subscription slot management is coming later"
        description="Slot allocation, status tracking, and renewals will be implemented in a future iteration."
      />
    </PageContainer>
  );
}

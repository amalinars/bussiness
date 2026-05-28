import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";

export default function PaymentsPage() {
  return (
    <PageContainer
      title="Payments"
      description="Review payment records, billing periods, amounts, and reconciliation status."
    >
      <EmptyState
        title="Payment tracking is coming later"
        description="Payment history, unpaid balances, and reconciliation workflows will be implemented in a future iteration."
      />
    </PageContainer>
  );
}

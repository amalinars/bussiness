import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";

export default function RemindersPage() {
  return (
    <PageContainer
      title="Reminders"
      description="Prepare operational reminder logs for renewals, unpaid invoices, and expiring slots."
    >
      <EmptyState
        title="Reminder logs are coming later"
        description="Reminder scheduling, delivery logs, and follow-up statuses will be implemented in a future iteration."
      />
    </PageContainer>
  );
}

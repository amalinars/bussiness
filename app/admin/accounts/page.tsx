import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";

export default function ServiceAccountsPage() {
  return (
    <PageContainer
      title="Service Accounts"
      description="Monitor shared service accounts, slot capacity, credentials metadata, and renewal status."
    >
      <EmptyState
        title="Service account tracking is coming later"
        description="Account inventory, slot allocation, and credential-safe metadata will be implemented in a future iteration."
      />
    </PageContainer>
  );
}

import { EmptyState } from "@/components/EmptyState";
import { PageContainer } from "@/components/PageContainer";

export default function PlatformsPage() {
  return (
    <PageContainer
      title="Platforms"
      description="Track digital subscription platforms such as streaming, productivity, and cloud services."
    >
      <EmptyState
        title="Platform catalog is coming later"
        description="Platform records, pricing references, and capacity rules will be implemented in a future iteration."
      />
    </PageContainer>
  );
}

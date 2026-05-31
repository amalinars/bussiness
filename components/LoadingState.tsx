import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-hidden="true">
      <span className="size-2 animate-bounce rounded-full border-2 border-border bg-main [animation-delay:-0.2s]" />
      <span className="size-2 animate-bounce rounded-full border-2 border-border bg-main [animation-delay:-0.1s]" />
      <span className="size-2 animate-bounce rounded-full border-2 border-border bg-main" />
    </span>
  );
}

export function LoadingStrip({ label = "Loading data...", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-base border-2 border-border bg-secondary-background px-4 py-3 text-sm font-heading shadow-shadow", className)}>
      <LoadingDots />
      <span>{label}</span>
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-base border-2 border-border bg-secondary-background", className)} />;
}

export function LoadingCard({ title = "Loading", description = "Fetching latest data..." }: { title?: string; description?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <LoadingDots />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-1/2" />
        <SkeletonBlock className="h-24 w-full" />
      </CardContent>
    </Card>
  );
}

export function PageLoadingState({ title, description }: { title: string; description?: string }) {
  return (
    <PageContainer title={title} description={description ?? "Loading latest dashboard data..."} eyebrow="Loading">
      <LoadingStrip label="Loading page data..." />
      <div className="grid gap-4 md:grid-cols-3">
        <LoadingCard title="Loading metrics" />
        <LoadingCard title="Loading records" />
        <LoadingCard title="Loading actions" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Loading table</CardTitle>
          <CardDescription>Preparing rows and filters.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Internal Dashboard</p>
          <h1 className="text-xl font-semibold tracking-tight">Subscription Operations</h1>
        </div>
        <div className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          No authentication enabled
        </div>
      </div>
    </header>
  );
}

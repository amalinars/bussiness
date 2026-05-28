export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b-4 border-border bg-secondary-background px-4 py-4 md:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-base">Internal Dashboard</p>
          <h1 className="text-xl font-heading font-black tracking-tight">Subscription Operations</h1>
        </div>
        <div className="rounded-base border-2 border-border bg-main px-3 py-1 text-xs font-base text-main-foreground shadow-shadow">
          No authentication enabled
        </div>
      </div>
    </header>
  );
}

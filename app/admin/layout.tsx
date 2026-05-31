import type { ReactNode } from "react";

import { AppSidebar } from "@/components/AppSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex md:h-screen md:overflow-hidden">
      <AppSidebar />
      <main className="min-w-0 flex-1 md:h-screen md:overflow-y-auto">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { LayoutDashboard, Server, UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Customers", href: "/admin/customers", icon: UsersRound },
  { title: "Service Accounts", href: "/admin/accounts", icon: Server },
];

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-full flex-col border-b-4 border-border bg-secondary-background p-4 md:min-h-screen md:w-72 md:border-b-0 md:border-r-4",
        className,
      )}
    >
      <div className="mb-6">
        <Link href="/admin/dashboard" className="block rounded-base border-2 border-border bg-main p-3 text-main-foreground shadow-shadow">
          <p className="text-lg font-heading font-black tracking-tight">Riztama Business</p>
          <p className="text-sm font-base">Internal Subscription Ops</p>
        </Link>
      </div>

      <nav className="grid gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-base border-2 border-border px-3 py-2 text-sm font-base shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
                isActive ? "bg-main" : "bg-background",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

import Link from "next/link";
import {
  BellRing,
  CreditCard,
  LayoutDashboard,
  MonitorPlay,
  ReceiptText,
  Server,
  UsersRound,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Customers", href: "/admin/customers", icon: UsersRound },
  { title: "Platforms", href: "/admin/platforms", icon: MonitorPlay },
  { title: "Service Accounts", href: "/admin/accounts", icon: Server },
  { title: "Subscriptions", href: "/admin/subscriptions", icon: ReceiptText },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Reminders", href: "/admin/reminders", icon: BellRing },
];

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-full flex-col border-b bg-card/80 p-4 backdrop-blur md:min-h-screen md:w-72 md:border-b-0 md:border-r",
        className,
      )}
    >
      <div className="mb-6">
        <Link href="/admin/dashboard" className="block">
          <p className="text-lg font-semibold tracking-tight">Riztama Business</p>
          <p className="text-sm text-muted-foreground">Subscription Management</p>
        </Link>
      </div>

      <nav className="grid gap-1 md:gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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

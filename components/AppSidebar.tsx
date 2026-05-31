"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, LayoutDashboard, Server, UsersRound, Menu, X, WalletCards, ScrollText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Customers", href: "/admin/customers", icon: UsersRound },
  { title: "Service Accounts", href: "/admin/accounts", icon: Server },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { title: "Financials", href: "/admin/finance", icon: WalletCards },
  { title: "Logs", href: "/admin/logs", icon: ScrollText },
];

type AppSidebarProps = {
  className?: string;
};

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header Banner with Menu Trigger */}
      <div className="flex w-full items-center justify-between border-b-4 border-border bg-secondary-background p-4 md:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={28}
            height={28}
            className="size-7 rounded-base border-2 border-black bg-white object-contain p-0.5"
          />
          <p className="text-lg font-heading font-black tracking-tight">Riztama</p>
        </Link>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="neutral"
          size="icon"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <aside
        className={cn(
          "hidden w-full flex-col border-b-4 border-border bg-secondary-background p-4 md:flex md:h-screen md:w-72 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r-4",
          isOpen && "flex border-b-4 md:border-b-0 md:border-r-4",
          className,
        )}
      >
        <div className="mb-6 hidden md:block">
          <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-base border-2 border-border bg-main p-3 text-main-foreground shadow-shadow">
            <Image
              src="/logo.png"
              alt="Riztama Logo"
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-base border-2 border-black bg-white object-contain p-0.5"
            />
            <div className="min-w-0">
              <p className="text-lg font-heading font-black tracking-tight leading-tight">Riztama</p>
              <p className="text-xs font-base opacity-90 leading-tight">Internal Ops</p>
            </div>
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
                onClick={() => setIsOpen(false)}
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
    </>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "active" | "warning" | "info";
};

const toneClasses = {
  neutral: "bg-secondary-background",
  active: "bg-[#dff4e8]",
  warning: "bg-main",
  info: "bg-[#d8e7ff]",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-base border-2 border-border px-2.5 py-1 text-xs font-base shadow-[2px_2px_0_0_var(--border)]",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

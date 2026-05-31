"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CountdownProps = {
  endDate: string;
  endTime: string | null;
  status: string;
  className?: string;
};

export function Countdown({ endDate, endTime, status, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (status !== "booked") {
      return;
    }

    const timeStr = endTime ? (endTime.includes(":") ? endTime : `${endTime}:00`) : "23:59:00";
    const targetDateStr = `${endDate}T${timeStr}`;

    function updateTimer() {
      // Parse using local time/UTC fallback consistently
      const targetTime = new Date(targetDateStr).getTime();

      // If parsing fails, fall back to simple date parser
      if (isNaN(targetTime)) {
        const [yr, mn, dy] = endDate.split("-").map(Number);
        const [hr, min, sec] = timeStr.split(":").map(Number);
        const fallbackTarget = new Date(yr, mn - 1, dy, hr, min, sec || 0);
        calculateDifference(fallbackTarget.getTime());
      } else {
        calculateDifference(targetTime);
      }
    }

    function calculateDifference(targetMs: number) {
      const nowMs = new Date().getTime();
      const diffMs = targetMs - nowMs;

      if (diffMs <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      setIsExpired(false);

      const sec = Math.floor((diffMs / 1000) % 60);
      const min = Math.floor((diffMs / (1000 * 60)) % 60);
      const hrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let formatted = "";
      if (days > 0) formatted += `${days}d `;
      if (days > 0 || hrs > 0) formatted += `${hrs}h `;
      if (days > 0 || hrs > 0 || min > 0) formatted += `${min}m `;
      formatted += `${sec}s left`;

      setTimeLeft(formatted);
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endDate, endTime, status]);

  if (status !== "booked") {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-base border border-border px-1.5 py-0.5 text-[10px] font-bold shadow-[1px_1px_0_0_var(--border)]",
        isExpired ? "bg-main text-black" : "bg-[#ffd8f4] text-black",
        className
      )}
    >
      {timeLeft}
    </span>
  );
}

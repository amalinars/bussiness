"use client";

import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLogEntry, AppLogLevel } from "@/lib/app-logs";

type LiveLogsPanelProps = {
  initialLogs: AppLogEntry[];
};

type LogsResponse = {
  logs: AppLogEntry[];
};

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(timestamp));
}

function badgeTone(level: AppLogLevel) {
  if (level === "success") {
    return "active";
  }

  if (level === "warn" || level === "error") {
    return "warning";
  }

  return "info";
}

function LogMeta({ meta }: { meta?: AppLogEntry["meta"] }) {
  if (!meta || Object.keys(meta).length === 0) {
    return <span className="text-sm font-base opacity-70">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(meta).map(([key, value]) => (
        <span key={key} className="rounded-base border-2 border-border bg-secondary-background px-2 py-1 text-xs font-base">
          {key}: {String(value)}
        </span>
      ))}
    </div>
  );
}

function SummaryCard({ title, entry, emptyText }: { title: string; entry?: AppLogEntry; emptyText: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{entry ? formatTimestamp(entry.timestamp) : emptyText}</CardDescription>
      </CardHeader>
      {entry ? (
        <CardContent className="space-y-3">
          <StatusBadge tone={badgeTone(entry.level)}>{entry.level}</StatusBadge>
          <p className="text-sm font-base">{entry.message}</p>
          <LogMeta meta={entry.meta} />
        </CardContent>
      ) : null}
    </Card>
  );
}

export function LiveLogsPanel({ initialLogs }: LiveLogsPanelProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestWorkerLog = useMemo(() => logs.find((log) => log.source === "booking-worker"), [logs]);
  const latestError = useMemo(() => logs.find((log) => log.level === "error"), [logs]);
  const latestSuccess = useMemo(() => logs.find((log) => log.level === "success"), [logs]);

  useEffect(() => {
    let ignore = false;

    async function refreshLogs() {
      setIsRefreshing(true);

      try {
        const response = await fetch("/api/logs", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch logs.");
        }

        const payload = (await response.json()) as LogsResponse;

        if (!ignore) {
          setLogs(payload.logs);
          setLastUpdatedAt(new Date());
          setError(null);
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch logs.");
        }
      } finally {
        if (!ignore) {
          setIsRefreshing(false);
        }
      }
    }

    const interval = window.setInterval(refreshLogs, 2000);
    void refreshLogs();

    return () => {
      ignore = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="rounded-base border-2 border-border bg-secondary-background px-4 py-3 text-sm font-base shadow-shadow">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Live update: {isRefreshing ? "syncing..." : "auto-refresh tiap 2 detik"}
          </span>
          <span>{lastUpdatedAt ? `Last update ${lastUpdatedAt.toLocaleTimeString("id-ID")}` : "Waiting first sync"}</span>
        </div>
        {error ? <p className="mt-2 font-heading text-red-700">{error}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Latest worker activity" entry={latestWorkerLog} emptyText="No worker activity yet." />
        <SummaryCard title="Latest successful check" entry={latestSuccess} emptyText="No successful check yet." />
        <SummaryCard title="Latest error" entry={latestError} emptyText="No error recorded." />
      </div>

      {logs.length === 0 ? (
        <EmptyState title="No logs yet" description="Start or wait for the booking worker. This page syncs automatically." />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent logs</CardTitle>
            <CardDescription>Latest {logs.length} persisted worker/server events. Auto-refresh aktif.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 lg:hidden">
              {logs.map((log) => (
                <div key={`${log.timestamp}-${log.message}`} className="rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusBadge tone={badgeTone(log.level)}>{log.level}</StatusBadge>
                    <StatusBadge tone="neutral">{log.source}</StatusBadge>
                  </div>
                  <p className="text-sm font-heading">{log.message}</p>
                  <p className="mt-1 text-xs font-base opacity-80">{formatTimestamp(log.timestamp)}</p>
                  <div className="mt-3">
                    <LogMeta meta={log.meta} />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="text-left font-heading">
                    <th className="border-b-2 border-border px-3 py-2">Time</th>
                    <th className="border-b-2 border-border px-3 py-2">Source</th>
                    <th className="border-b-2 border-border px-3 py-2">Level</th>
                    <th className="border-b-2 border-border px-3 py-2">Message</th>
                    <th className="border-b-2 border-border px-3 py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={`${log.timestamp}-${log.message}`}>
                      <td className="border-b-2 border-border px-3 py-3 align-top font-base">{formatTimestamp(log.timestamp)}</td>
                      <td className="border-b-2 border-border px-3 py-3 align-top">
                        <StatusBadge tone="neutral">{log.source}</StatusBadge>
                      </td>
                      <td className="border-b-2 border-border px-3 py-3 align-top">
                        <StatusBadge tone={badgeTone(log.level)}>{log.level}</StatusBadge>
                      </td>
                      <td className="border-b-2 border-border px-3 py-3 align-top font-base">{log.message}</td>
                      <td className="border-b-2 border-border px-3 py-3 align-top">
                        <LogMeta meta={log.meta} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

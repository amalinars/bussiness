import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type AppLogLevel = "info" | "warn" | "error" | "success";
export type AppLogSource = "booking-worker" | "server";

export type AppLogEntry = {
  timestamp: string;
  source: AppLogSource;
  level: AppLogLevel;
  message: string;
  meta?: Record<string, string | number | boolean | null>;
};

export const appLogFilePath = path.join(process.cwd(), ".app-logs", "worker.jsonl");

const MAX_READ_BYTES = 1024 * 1024;

function sanitizeMeta(meta: AppLogEntry["meta"]): AppLogEntry["meta"] {
  if (!meta) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(meta).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value) || value === null),
  );
}

export async function appendAppLog(entry: Omit<AppLogEntry, "timestamp"> & { timestamp?: string }): Promise<void> {
  const nextEntry: AppLogEntry = {
    timestamp: entry.timestamp ?? new Date().toISOString(),
    source: entry.source,
    level: entry.level,
    message: entry.message,
    meta: sanitizeMeta(entry.meta),
  };

  await mkdir(path.dirname(appLogFilePath), { recursive: true });
  await writeFile(appLogFilePath, `${JSON.stringify(nextEntry)}\n`, { flag: "a" });
}

export async function getAppLogs({ limit = 100 }: { limit?: number } = {}): Promise<AppLogEntry[]> {
  try {
    const content = await readFile(appLogFilePath, "utf8");
    const tail = content.length > MAX_READ_BYTES ? content.slice(-MAX_READ_BYTES) : content;
    const lines = tail.split("\n").filter(Boolean).slice(-limit);

    return lines
      .map((line) => {
        try {
          return JSON.parse(line) as AppLogEntry;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is AppLogEntry => Boolean(entry))
      .reverse();
  } catch {
    return [];
  }
}

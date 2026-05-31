import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export const appLogFilePath = path.join(process.cwd(), ".app-logs", "worker.jsonl");

const MAX_READ_BYTES = 1024 * 1024;

function sanitizeMeta(meta) {
  if (!meta) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(meta).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value) || value === null),
  );
}

export async function appendAppLog(entry) {
  const nextEntry = {
    timestamp: entry.timestamp ?? new Date().toISOString(),
    source: entry.source,
    level: entry.level,
    message: entry.message,
    meta: sanitizeMeta(entry.meta),
  };

  await mkdir(path.dirname(appLogFilePath), { recursive: true });
  await writeFile(appLogFilePath, `${JSON.stringify(nextEntry)}\n`, { flag: "a" });
}

export async function getAppLogs({ limit = 100 } = {}) {
  try {
    const content = await readFile(appLogFilePath, "utf8");
    const tail = content.length > MAX_READ_BYTES ? content.slice(-MAX_READ_BYTES) : content;
    const lines = tail.split("\n").filter(Boolean).slice(-limit);

    return lines
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .reverse();
  } catch {
    return [];
  }
}

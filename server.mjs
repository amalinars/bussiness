import { createServer } from "http";
import next from "next";
import { createClient } from "@supabase/supabase-js";

import { appendAppLog } from "./lib/app-logs.mjs";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const workerIntervalMs = Number(process.env.BOOKING_EXPIRY_WORKER_INTERVAL_MS || 30000);
const supabaseSchema = "riztama_business";

let workerInterval = null;
let workerCountdownStarted = false;
let workerRunning = false;
let workerNextRunAt = 0;

function createSupabaseWorkerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    db: {
      schema: supabaseSchema,
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function logWorkerEvent(level, message, meta) {
  try {
    await appendAppLog({ source: "booking-worker", level, message, meta });
  } catch (error) {
    console.error("[booking-worker] failed to write app log:", error);
  }
}

async function completeExpiredBookings() {
  if (workerRunning) {
    const message = "previous check still running, skipping this tick.";
    console.log(`[booking-worker] ${message}`);
    await logWorkerEvent("warn", message);
    return;
  }

  const supabase = createSupabaseWorkerClient();

  if (!supabase) {
    const message = "skipped: Supabase env is missing.";
    console.warn(`[booking-worker] ${message}`);
    await logWorkerEvent("warn", message);
    return;
  }

  workerRunning = true;
  workerNextRunAt = Date.now() + workerIntervalMs;

  try {
    const startMessage = `checking expired bookings in schema '${supabaseSchema}'...`;
    console.log(`[booking-worker] ${startMessage}`);
    await logWorkerEvent("info", startMessage, { schema: supabaseSchema });

    const { error } = await supabase.rpc("complete_expired_bookings");

    if (error) {
      const message = `failed: ${error.message}`;
      console.error("[booking-worker] failed:", error.message);
      await logWorkerEvent("error", message);
    } else {
      const checkedAt = new Date().toLocaleTimeString();
      const message = `check complete at ${checkedAt}`;
      console.log(`[booking-worker] ${message}`);
      await logWorkerEvent("success", message);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown worker crash";
    console.error("[booking-worker] crashed:", error);
    await logWorkerEvent("error", `crashed: ${message}`);
  } finally {
    workerRunning = false;
  }
}

function startBookingExpiryWorker() {
  if (workerInterval) {
    return;
  }

  console.log(`[booking-worker] started. Schema: ${supabaseSchema}. Interval: ${workerIntervalMs}ms`);
  void logWorkerEvent("info", "worker started", { schema: supabaseSchema, intervalMs: workerIntervalMs });

  void completeExpiredBookings();
  workerInterval = setInterval(() => {
    void completeExpiredBookings();
  }, workerIntervalMs);

  if (!workerCountdownStarted) {
    workerCountdownStarted = true;
    setInterval(() => {
      const remainingMs = Math.max(0, workerNextRunAt - Date.now());
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      console.log(`[booking-worker] next expiry check in ${remainingSeconds}s`);
    }, 1000);
  }
}

app.prepare().then(() => {
  startBookingExpiryWorker();

  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (error) {
      console.error("Next request handler error:", error);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }).listen(port, hostname, () => {
    console.log(`Ready on http://${hostname}:${port}`);
  });
});

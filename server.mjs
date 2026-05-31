import { createServer } from "http";
import next from "next";
import { createClient } from "@supabase/supabase-js";

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

async function completeExpiredBookings() {
  if (workerRunning) {
    console.log("[booking-worker] previous check still running, skipping this tick.");
    return;
  }

  const supabase = createSupabaseWorkerClient();

  if (!supabase) {
    console.warn("[booking-worker] skipped: Supabase env is missing.");
    return;
  }

  workerRunning = true;
  workerNextRunAt = Date.now() + workerIntervalMs;

  try {
    console.log(`[booking-worker] checking expired bookings in schema '${supabaseSchema}'...`);
    const { error } = await supabase.rpc("complete_expired_bookings");

    if (error) {
      console.error("[booking-worker] failed:", error.message);
    } else {
      console.log(`[booking-worker] check complete at ${new Date().toLocaleTimeString()}`);
    }
  } catch (error) {
    console.error("[booking-worker] crashed:", error);
  } finally {
    workerRunning = false;
  }
}

function startBookingExpiryWorker() {
  if (workerInterval) {
    return;
  }

  console.log(`[booking-worker] started. Schema: ${supabaseSchema}. Interval: ${workerIntervalMs}ms`);

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

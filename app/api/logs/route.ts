import { NextResponse } from "next/server";

import { getAppLogs } from "@/lib/app-logs";

export async function GET() {
  const logs = await getAppLogs({ limit: 100 });

  return NextResponse.json({ logs });
}

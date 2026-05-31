import { connection } from "next/server";

import { PageContainer } from "@/components/PageContainer";
import { getAppLogs } from "@/lib/app-logs";

import { LiveLogsPanel } from "./LiveLogsPanel";

export default async function LogsPage() {
  await connection();

  const logs = await getAppLogs({ limit: 100 });

  return (
    <PageContainer
      eyebrow="Operations"
      title="Logs"
      description="Pantauan aktivitas server lokal, terutama worker auto-complete booking. Halaman ini auto-refresh tiap 2 detik."
    >
      <LiveLogsPanel initialLogs={logs} />
    </PageContainer>
  );
}

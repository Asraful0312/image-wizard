import { AppShell } from "@/components/app-shell";
import { HistoryPage } from "@/components/history-page";
import { Suspense } from "react";

export default function History() {
  return (
    <AppShell>
      <Suspense fallback="<div>Loading...</div>">
        <HistoryPage />
      </Suspense>
    </AppShell>
  );
}

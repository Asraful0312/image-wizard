import { AppShell } from "@/components/app-shell";
import { HistoryPage } from "@/components/history-page";
import Loader from "@/components/Loader";

import { Suspense } from "react";


export default function History() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <HistoryPage />
      </Suspense>
    </AppShell>
  );
}

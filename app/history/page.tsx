import { AppShell } from "@/components/app-shell";
import { HistoryPage } from "@/components/history-page";
import Loader from "@/components/Loader";

import { Suspense } from "react";

export const metadata = {
  title: "History",
  robots: {
    index: true, // Allow indexing
    follow: true, // Allow link following
  },
};

export default function History() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <HistoryPage />
      </Suspense>
    </AppShell>
  );
}

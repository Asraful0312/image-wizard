import { AppShell } from "@/components/app-shell";
import Loader from "@/components/Loader";
import RemoveBgPage from "@/components/remove-bg";
import { Suspense } from "react";

export const metadata = {
  title: "Background remover",
  robots: {
    index: true, // Allow indexing
    follow: true, // Allow link following
  },
};

export default function RemoveBg() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <RemoveBgPage />
      </Suspense>
    </AppShell>
  );
}

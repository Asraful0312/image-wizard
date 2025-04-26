import { AppShell } from "@/components/app-shell";
import { ConvertPage } from "@/components/convert-page";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function Home() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <ConvertPage />
      </Suspense>
    </AppShell>
  );
}

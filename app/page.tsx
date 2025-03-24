import { AppShell } from "@/components/app-shell";
import { ConvertPage } from "@/components/convert-page";
import { Suspense } from "react";

export default function Home() {
  return (
    <AppShell>
      <Suspense fallback="<div>Loading...</div>">
        <ConvertPage />
      </Suspense>
    </AppShell>
  );
}

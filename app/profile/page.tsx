import { AppShell } from "@/components/app-shell";
import { ProfilePage } from "@/components/profile-page";
import { Suspense } from "react";

export default function Profile() {
  return (
    <AppShell>
      <Suspense fallback="<div>Loading...</div">
        <ProfilePage />
      </Suspense>
    </AppShell>
  );
}

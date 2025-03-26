import { AppShell } from "@/components/app-shell";
import Loader from "@/components/Loader";
import { ProfilePage } from "@/components/profile-page";
import { Suspense } from "react";

export default function Profile() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <ProfilePage />
      </Suspense>
    </AppShell>
  );
}

import { AppShell } from "@/components/app-shell";
import Loader from "@/components/Loader";
import { ProfilePage } from "@/components/profile-page";
import { Suspense } from "react";

export const metadata = {
  title: "Profile",
  robots: {
    index: true, // Allow indexing
    follow: true, // Allow link following
  },
};

export default function Profile() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <ProfilePage />
      </Suspense>
    </AppShell>
  );
}

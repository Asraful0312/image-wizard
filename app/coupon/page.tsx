import { AppShell } from "@/components/app-shell";
import { CouponPage } from "@/components/coupon-page";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export const metadata = {
  title: "Coupon",
  robots: {
    index: true, // Allow indexing
    follow: true, // Allow link following
  },
};

export default function Coupon() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <CouponPage />
      </Suspense>
    </AppShell>
  );
}

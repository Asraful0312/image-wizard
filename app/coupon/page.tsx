import { AppShell } from "@/components/app-shell";
import { CouponPage } from "@/components/coupon-page";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function Coupon() {
  return (
    <AppShell>
      <Suspense fallback={<Loader />}>
        <CouponPage />
      </Suspense>
    </AppShell>
  );
}

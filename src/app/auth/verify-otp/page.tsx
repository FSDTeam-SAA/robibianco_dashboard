import VerifyOtp from "@/components/dashboard/Auth/VerifyOtp";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense>
        <VerifyOtp />
      </Suspense>
    </div>
  );
}

import ResetPassword from "@/components/dashboard/Auth/ResetPassword";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense>
        <ResetPassword />
      </Suspense>
    </div>
  );
}

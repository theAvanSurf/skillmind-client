"use client";

import { Suspense } from "react";
import Step5Form from "@/features/auth/forms/Step5Form";

export default function RegisterStep5Page() {
  return (
    <Suspense fallback={null}>
      <Step5Form />
    </Suspense>
  );
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUserStorage } from "@/store/create-user-storage"

/** Maps each completedStep value to the route the user should be picked up at. */
export const RESUME_ROUTE: Record<number, string> = {
  0: "/register",
  1: "/register/step2",
  2: "/register/step3",
  3: "/register/step5",
  4: "/register/billing",   // premium: after email verify
  5: "/register/profiles", // free: after email verify; premium: after billing
  6: "/register/welcome",
}

/**
 * Call at the top of every registration step.
 * @param requiredStep - minimum `completedStep` the user must have to view this page.
 * @param isEntryPoint  - set true on the first page (/register) so it also
 *                        redirects forward when the user already has progress.
 */
export function useRegistrationGuard(requiredStep: number, isEntryPoint = false) {
  const router = useRouter()
  const completedStep = createUserStorage((s) => s.completedStep)

  useEffect(() => {
    if (completedStep < requiredStep) {
      // Not far enough — send them to where they actually are
      router.replace(RESUME_ROUTE[completedStep] ?? "/register")
    } else if (isEntryPoint && completedStep > 0) {
      // Already in progress — skip the entry page and resume
      router.replace(RESUME_ROUTE[completedStep] ?? "/register")
    }
  }, [completedStep, requiredStep, isEntryPoint, router])

  return completedStep >= requiredStep
}

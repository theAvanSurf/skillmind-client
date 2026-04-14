"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUserStorage } from "@/store/create-user-storage"

/** Returns the correct resume route based on completed step and role. */
export function getResumeRoute(completedStep: number, role?: string | null): string {
  // Professor-specific branching at step 2
  if (completedStep === 2 && role === "professor") return "/register/professor-info"

  const map: Record<number, string> = {
    0: "/register",
    1: "/register/step2",
    2: "/register/step3",
    7: "/register/stripe-connect",
    3: "/register/step5",
    4: "/register/billing",
    5: "/register/profiles",
    6: "/register/welcome",
  }
  return map[completedStep] ?? "/register"
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
  const role = createUserStorage((s) => s.registrationDraft.role)

  useEffect(() => {
    if (completedStep < requiredStep) {
      // Not far enough — send them to where they actually are
      router.replace(getResumeRoute(completedStep, role) ?? "/register")
    } else if (isEntryPoint && completedStep > 0) {
      // Already in progress — skip the entry page and resume
      router.replace(getResumeRoute(completedStep, role) ?? "/register")
    }
  }, [completedStep, requiredStep, isEntryPoint, role, router])

  return completedStep >= requiredStep
}

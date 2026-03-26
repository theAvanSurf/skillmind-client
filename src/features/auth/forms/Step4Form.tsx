"use client"

import React, { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import AuthLayout from "../components/AuthLayout"
import { useRegistrationGuard } from "../hooks/useRegistrationGuard"
import { createUserStorage } from "@/store/create-user-storage"
import AuthenticationServices from "@/features/auth/services/auth-services"
import type { PlanSelection } from "@/types/billing.types"

const authServices = new AuthenticationServices()

const freePlanFeatures = [
  "Up to 5 user profiles",
  "Access on 2 devices",
  "Full course library",
  "Basic progress tracking",
  "Community & forums",
  "Standard video quality",
  "ML-powered recommendations",
]

const premiumPlanFeatures = [
  "Up to 5 user profiles",
  "Access on 4 devices",
  "Detailed progress statistics",
  "HD & 4K video quality",
  "Download courses offline",
  "Bookmarks & favorites",
  "Personal notes per course",
  "Custom alerts & reminders",
  "Multi-screen mode",
]

export default function PlanSelectionStep() {
  const router = useRouter()
  const setCompletedStep = createUserStorage((s) => s.setCompletedStep)
  const setRegistrationDraft = createUserStorage((s) => s.setRegistrationDraft)
  const setUserId = createUserStorage((s) => s.setUserId)
  const draft = createUserStorage((s) => s.registrationDraft)
  const completedStep = createUserStorage((s) => s.completedStep)
  const allowed = useRegistrationGuard(2)
  const [selectedPlan, setSelectedPlan] = useState<PlanSelection>(draft.plan ?? null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const handleContinue = async () => {
    if (!selectedPlan) return
    setRegistrationDraft({ plan: selectedPlan })
    setApiError("")

    // If already signed up (backtracking), skip the API call
    if (completedStep >= 3) {
      router.push("/register/step5")
      return
    }

    // Create account for both free and premium — billing happens after email verify
    setLoading(true)
    try {
      const response = await authServices.signUp({
        Name: draft.firstName ?? "",
        LastName: draft.lastName ?? "",
        UserName: draft.userName ?? "",
        Email: draft.email ?? "",
        Password: draft.password ?? "",
        BirthDate: draft.birthDate ?? "",
        PhoneNumber: draft.phone ?? "",
        Country: draft.country ?? "",
        AccountTypes: selectedPlan === "premium" ? 1 : 0,
        Role: 2,
      })

      if (!response.id) throw new Error("Registration failed. Please try again.")

      setUserId(response.id)
      setCompletedStep(3)
      router.push("/register/step5")
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout step={3} totalSteps={5} title="Choose Your Plan" wide>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
        <p className="mt-1 text-xs text-white/40">
          Select the plan that fits your learning goals
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Free Plan */}
        <button
          type="button"
          onClick={() => setSelectedPlan("free")}
          className={`rounded-xl border-2 p-5 text-left transition-all ${
            selectedPlan === "free"
              ? "border-blue-500/60 bg-blue-500/8"
              : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
          }`}
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-blue-400">Free</h3>
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                selectedPlan === "free"
                  ? "border-blue-500 bg-blue-500"
                  : "border-white/30"
              }`}
            >
              {selectedPlan === "free" && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>
          <p className="mb-4 text-2xl font-bold text-white">
            $0
            <span className="text-sm font-normal text-white/40">/mo</span>
          </p>
          <ul className="space-y-2">
            {freePlanFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400/60" />
                <span className="text-xs text-white/55">{f}</span>
              </li>
            ))}
          </ul>
        </button>

        {/* Premium Plan */}
        <button
          type="button"
          onClick={() => setSelectedPlan("premium")}
          className={`relative rounded-xl border-2 p-5 text-left transition-all ${
            selectedPlan === "premium"
              ? "border-blue-500/60 bg-blue-500/8"
              : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
          }`}
        >
          <div className="absolute -top-2.5 left-4">
            <span className="rounded-full bg-linear-to-r from-blue-500 to-sky-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-500/30">
              Popular
            </span>
          </div>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-blue-400">Premium</h3>
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                selectedPlan === "premium"
                  ? "border-blue-500 bg-blue-500"
                  : "border-white/30"
              }`}
            >
              {selectedPlan === "premium" && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>
          <p className="mb-4 text-2xl font-bold text-white">
            $9.99
            <span className="text-sm font-normal text-white/40">/mo</span>
          </p>
          <ul className="space-y-2">
            {premiumPlanFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                <span className="text-xs text-white/55">{f}</span>
              </li>
            ))}
          </ul>
        </button>
      </div>

      {apiError && (
        <p className="mt-3 text-center text-xs text-red-400">{apiError}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => router.push("/register/step2")}
          className="rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/60 transition-all hover:border-white/20 hover:text-white/90"
        >
          Back
        </button>
        <button
          disabled={!selectedPlan || loading}
          onClick={handleContinue}
          className={`rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            selectedPlan && !loading
              ? "bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700"
              : "cursor-not-allowed bg-white/10 text-white/30"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Creating account…
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </AuthLayout>
  )
}

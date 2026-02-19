"use client"

import React, { useState } from "react"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import AuthLayout from "./AuthLayout"
import type { PlanSelection } from "@/types/billing.types"

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
  const [selectedPlan, setSelectedPlan] = useState<PlanSelection>(null)

  const handleContinue = () => {
    if (selectedPlan === "premium") {
      router.push("/register/billing?plan=premium")
    } else {
      router.push("/register/step5")
    }
  }

  return (
    <AuthLayout step={4} totalSteps={5} title="Choose Your Plan" wide>
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
              ? "border-orange-500/60 bg-orange-500/8"
              : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
          }`}
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-orange-400">Free</h3>
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                selectedPlan === "free"
                  ? "border-orange-500 bg-orange-500"
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
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400/60" />
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
              ? "border-orange-500/60 bg-orange-500/8"
              : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6"
          }`}
        >
          <div className="absolute -top-2.5 left-4">
            <span className="rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-500/30">
              Popular
            </span>
          </div>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-orange-400">Premium</h3>
            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                selectedPlan === "premium"
                  ? "border-orange-500 bg-orange-500"
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
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
                <span className="text-xs text-white/55">{f}</span>
              </li>
            ))}
          </ul>
        </button>
      </div>

      <button
        disabled={!selectedPlan}
        onClick={handleContinue}
        className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
          selectedPlan
            ? "bg-linear-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700"
            : "cursor-not-allowed bg-white/10 text-white/30"
        }`}
      >
        Continue
      </button>
    </AuthLayout>
  )
}

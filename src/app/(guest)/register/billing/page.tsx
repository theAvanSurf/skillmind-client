"use client"

import { useState, useEffect, Suspense } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { useRouter } from "next/navigation"
import AuthLayout from "@/features/auth/components/AuthLayout"
import { stripePromise } from "@/lib/stripe"
import { useRegistrationGuard } from "@/features/auth/hooks/useRegistrationGuard"
import { createUserStorage } from "@/store/create-user-storage"
import PaymentForm from "@/app/(guest)/register/PaymentForm"
import BillingSummary from "@/app/(guest)/register/BillingSummary"
import type { PlanType, BillingInfo } from "@/types/billing.types"

const PREMIUM_PLAN: PlanType = {
  id: "premium",
  name: "SkillMind Premium",
  price: 9.99,
  interval: "month",
  features: ["Unlimited courses", "AI personalisation", "Certificates"],
  popular: true,
  priceId: "Skillmind_Premium_Plan-42a1204",
}

const TAX_RATE = 0.18 // ITBIS 18 %

function buildBillingInfo(plan: PlanType, discount = 0, promoCode?: string): BillingInfo {
  const subtotal = plan.price
  const discountAmt = discount
  const taxable = subtotal - discountAmt
  const tax = parseFloat((taxable * TAX_RATE).toFixed(2))
  const total = parseFloat((taxable + tax).toFixed(2))
  return { plan, subtotal, tax, discount: discountAmt, total, promoCode }
}

function normalizeClientSecret(raw: unknown): string {
  const secret = typeof raw === "string" ? raw.trim() : ""
  if (!secret) return ""

  // Backend may return URL-encoded secrets. Stripe Elements expects the decoded form.
  try {
    return decodeURIComponent(secret)
  } catch {
    return secret
  }
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <AuthLayout step={4} totalSteps={6} title="Billing" wide>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </AuthLayout>
    }>
      <BillingPageInner />
    </Suspense>
  )
}

function BillingPageInner() {
  const router = useRouter()
  const completedStep = createUserStorage((s) => s.completedStep)
  const setCompletedStep = createUserStorage((s) => s.setCompletedStep)
  const allowed = useRegistrationGuard(4)

  const [clientSecret, setClientSecret] = useState("")
  const [error, setError] = useState("")
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(() =>
    buildBillingInfo(PREMIUM_PLAN)
  )

  // If billing was already completed, skip ahead
  useEffect(() => {
    if (completedStep >= 5) {
      router.replace("/register/profiles")
    }
  }, [completedStep, router])

  // Call create-subscription on mount to get the PaymentIntent clientSecret
  useEffect(() => {
    if (!allowed) return
    const init = async () => {
      try {
        const res = await fetch("/api/payment/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to initialise checkout")

        const normalizedSecret = normalizeClientSecret(data.clientSecret)
        if (!normalizedSecret) throw new Error("Failed to initialise checkout")

        setClientSecret(normalizedSecret)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialise checkout")
      }
    }
    init()
  }, [allowed]) // eslint-disable-line

  const handleApplyPromo = (code: string) => {
    // Placeholder — wire to a real promo-code API when available
    const discount = code.toUpperCase() === "SKILL10" ? 1.0 : 0
    setBillingInfo(buildBillingInfo(PREMIUM_PLAN, discount, code))
  }

  const handleBack = () => router.back()

  const handleSuccess = () => {
    setCompletedStep(5)
    router.push("/register/profiles")
  }

  const stripeAppearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#0f172a",
      colorText: "#f8fafc",
      colorDanger: "#ef4444",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      borderRadius: "12px",
    },
  }

  if (error) {
    return (
      <AuthLayout step={4} totalSteps={6} title="Billing" wide>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-white/20 hover:text-white/90"
          >
            Try Again
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout step={4} totalSteps={6} title="Billing" wide>
      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: stripeAppearance }}
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Left — payment form */}
            <PaymentForm
              plan={PREMIUM_PLAN}
              billingInfo={billingInfo}
              onBack={handleBack}
              onSuccess={handleSuccess}
              returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/register/billing/return`}
            />
            {/* Right — billing summary */}
            <BillingSummary
              billingInfo={billingInfo}
              onApplyPromo={handleApplyPromo}
            />
          </div>
        </Elements>
      ) : (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      )}
    </AuthLayout>
  )
}


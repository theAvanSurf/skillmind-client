"use client"

import { useState, useEffect, Suspense } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { useRouter, useSearchParams } from "next/navigation"
import PaymentForm from "@/app/(guest)/register/PaymentForm"
import BillingSummary from "@/app/(guest)/register/BillingSummary"
import AuthLayout from "@/features/auth/components/AuthLayout"
import { stripePromise } from "@/lib/stripe"
import { sileo } from "sileo"
import type { PlanType, BillingInfo } from "@/types/billing.types"

const premiumPlan: PlanType = {
  id: "premium",
  name: "Premium Plan",
  price: 9.99,
  interval: "month",
  priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "price_premium",
  popular: true,
  features: [
    "Up to five users profiles",
    "Access on 6 devices",
    "Detailed progress statistics",
    "HD and 4K video quality",
    "Download courses to watch offline",
    "Playlists and favorites",
  ],
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <AuthLayout step={4} totalSteps={5} title="Billing Information" wide>
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
  const searchParams = useSearchParams()
  // We can retrieve email from query if passed, otherwise default or ask user
  // For now let's assume we don't have it and the PaymentForm will handle collecting details for Stripe.

  const [clientSecret, setClientSecret] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: premiumPlan,
    subtotal: premiumPlan.price,
    tax: premiumPlan.price * 0.18,
    discount: 0,
    total: premiumPlan.price + (premiumPlan.price * 0.18),
  })

  useEffect(() => {
    // Create Payment Intent on mount
    const createIntent = async () => {
      try {
        const promise = fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "user@example.com",
            amount: Math.round(billingInfo.total * 100),
          }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to initialize payment");
          return data;
        });

        const data = await sileo.promise(promise, {
          loading: { title: "Initializing payment...", description: "Setting up secure checkout" },
          success: { title: "Ready to pay", description: "Payment intent created successfully" },
          error: (err: any) => ({
            title: "Payment Error",
            description: err.message || "Failed to initialize payment flow"
          })
        });

        setClientSecret(data.clientSecret)
      } catch (err) {
        console.error(err)
        setError("Failed to initialize payment. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    createIntent()
  }, []) // eslint-disable-line

  const handleApplyPromo = (code: string) => {
    if (code === "SAVE10") {
      const discount = billingInfo.subtotal * 0.1;
      const newTotal = billingInfo.subtotal - discount + billingInfo.tax;
      setBillingInfo((prev) => ({
        ...prev,
        discount,
        total: newTotal,
      }));
    }
  }

  const handleSuccess = () => {
    router.push("/register/step5")
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <AuthLayout step={4} totalSteps={5} title="Billing Information" wide>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AuthLayout>
    )
  }

  if (error) {
    return (
      <AuthLayout step={4} totalSteps={5} title="Billing Information" wide>
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-700 underline"
          >
            Try Again
          </button>
        </div>
      </AuthLayout>
    )
  }

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff0a',
      colorText: '#ffffff',
      colorTextSecondary: '#ffffff99',
      colorTextPlaceholder: '#ffffff40',
      colorIconTab: '#ffffff',
      borderRadius: '12px',
      fontFamily: 'Poppins, sans-serif',
    },
    rules: {
      '.Input': {
        border: '1px solid rgba(255,255,255,0.10)',
        backgroundColor: 'rgba(255,255,255,0.06)',
        color: '#ffffff',
      },
      '.Input:focus': {
        border: '1px solid rgba(249,115,22,0.5)',
        boxShadow: '0 0 0 2px rgba(249,115,22,0.15)',
      },
      '.Tab': {
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.04)',
      },
      '.Tab:hover': {
        backgroundColor: 'rgba(255,255,255,0.07)',
      },
      '.Tab--selected': {
        border: '1px solid rgba(249,115,22,0.4)',
        backgroundColor: 'rgba(249,115,22,0.08)',
      },
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <AuthLayout step={4} totalSteps={5} title="Billing Information" subtitle="Secure Payment" wide>
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Payment Form — takes ~60% */}
        <div className="flex-1 min-w-0">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <PaymentForm
                plan={premiumPlan}
                billingInfo={billingInfo}
                onBack={handleBack}
                onSuccess={handleSuccess}
                returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/register/step5`}
              />
            </Elements>
          )}
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block w-px bg-white/6 self-stretch" />

        {/* Billing Summary — fixed width sidebar */}
        <div className="lg:w-64 shrink-0">
          <BillingSummary
            billingInfo={billingInfo}
            onApplyPromo={handleApplyPromo}
          />
        </div>
      </div>
    </AuthLayout>
  )
}

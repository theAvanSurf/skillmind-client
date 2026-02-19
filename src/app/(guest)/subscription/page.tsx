"use client";

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SubscriptionPlans from "./SubscriptionPlans";
import PaymentForm from "./PaymentForm";
import BillingSummary from "./BillingSummary";
import { Brain, Eye, EyeOff, Loader2 } from "lucide-react";

/* ---------- CLAVE PUBLICA ---------- */
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Stripe public key no está configurada en .env.local");
}

const stripePromise = loadStripe(publishableKey);

/* ---------- TYPES ---------- */
export interface PlanType {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
  priceId: string;
}

export interface BillingInfo {
  plan: PlanType | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
}

/* ---------- COMPONENT ---------- */
export default function SubscriptionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: null,
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  /* ---------- PLANES ---------- */
  const plans: PlanType[] = [
    {
      id: "free",
      name: "Base Plan",
      price: 0,
      interval: "month",
      priceId: "price_free",
      features: [
        "Up to five users profiles",
        "Access on 2 devices",
        "Full access to all courses",
        "Progress tracking",
        "Community participation and forums",
        "Standard video quality",
        "Machine Learning recommendations",
      ],
    },
    {
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
        "Notes per course",
        "Personalized recommendations",
        "Multi-screen playback",
      ],
    },
  ];

  /* ---------- SELECCIONAR PLAN ---------- */
  const handlePlanSelect = async (plan: PlanType) => {
    setError("");
    setSelectedPlan(plan);

    const subtotal = plan.price;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    setBillingInfo({
      plan,
      subtotal,
      tax,
      discount: 0,
      total,
    });

    if (plan.price === 0) {
      setCurrentStep(3);
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "user@email.com",
          amount: Math.round(total * 100),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating payment");
      }

      setClientSecret(data.clientSecret);
      setCurrentStep(2);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Unexpected error");
    }
  };

  /* ---------- APPLY PROMO ---------- */
  const handleApplyPromo = (code: string) => {
    // Example: SAVE10 gives 10% discount
    if (code === "SAVE10") {
      const discount = billingInfo.subtotal * 0.1;
      const newTotal = billingInfo.subtotal - discount + billingInfo.tax;
      setBillingInfo((prev) => ({
        ...prev,
        discount,
        total: newTotal,
        promoCode: code,
      }));
    }
  };

  /* ---------- STRIPE OPTIONS ---------- */
  const options = {
    clientSecret,
    appearance: { theme: "stripe" as const },
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 py-10 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
         {/* Header con logo */}
      <header className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-purple-500" />
          </div>
          <span className="text-lg sm:text-xl font-semibold">
            <span className="text-orange-500">Skill</span>
            <span className="text-purple-600">Mind</span>
          </span>
        </div>
      </header>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Select Plan", "Payment", "Confirmation"].map((label, i) => {
            const step = i + 1;
            const isActive = currentStep === step;
            const isDone = currentStep > step;
            return (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isDone ? "✓" : step}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:block ${
                      isActive ? "text-purple-600" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-1 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto mb-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: Plan selection (full width) */}
      {currentStep === 1 && (
        <div className="max-w-3xl mx-auto">
          <SubscriptionPlans plans={plans} onSelectPlan={handlePlanSelect} />
        </div>
      )}

      {/* Step 2: Payment + Billing Summary side by side */}
      {currentStep === 2 && clientSecret && selectedPlan && (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 items-start">
          {/* Payment form takes 2/3 */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                plan={selectedPlan}
                billingInfo={billingInfo}
                onBack={() => setCurrentStep(1)}
                onSuccess={() => setCurrentStep(3)}
              />
            </Elements>
          </div>
          {/* Billing summary takes 1/3, sticky */}
          <div className="lg:col-span-1">
            <BillingSummary
              billingInfo={billingInfo}
              onApplyPromo={handleApplyPromo}
            />
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {currentStep === 3 && (
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to the SkillMind Family!
            </h2>
            <p className="text-gray-500 mb-6">Happy Learning!</p>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

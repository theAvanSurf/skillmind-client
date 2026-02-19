"use client";

import { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Importar tipos desde page.tsx
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

interface PaymentFormProps {
  plan: PlanType;
  billingInfo: BillingInfo;
  onBack: () => void;
  onSuccess: () => void;
  returnUrl?: string;
}

export default function PaymentForm({
  plan,
  billingInfo,
  onBack,
  onSuccess,
  returnUrl,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate personal info
    if (
      !personalInfo.firstName ||
      !personalInfo.lastName ||
      !personalInfo.email
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirm payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/subscription/success`,
          payment_method_data: {
            billing_details: {
              name: `${personalInfo.firstName} ${personalInfo.lastName}`,
              email: personalInfo.email,
              phone: personalInfo.phone,
            },
          },
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred");
        setLoading(false);
      } else {
        // Payment successful
        onSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/50">
        Payment Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            Personal Details
          </p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              onChange={handlePersonalInfoChange}
              className="w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-orange-500/50 focus:bg-white/9 focus:ring-2 focus:ring-orange-500/15"
              placeholder="First Name *"
              required
            />
            <input
              type="text"
              name="lastName"
              value={personalInfo.lastName}
              onChange={handlePersonalInfoChange}
              className="w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-orange-500/50 focus:bg-white/9 focus:ring-2 focus:ring-orange-500/15"
              placeholder="Last Name *"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={personalInfo.email}
            onChange={handlePersonalInfoChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-orange-500/50 focus:bg-white/9 focus:ring-2 focus:ring-orange-500/15"
            placeholder="Email Address *"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            Payment Method
          </p>
          <div className="rounded-xl border border-white/10 bg-white/4 p-4">
            <PaymentElement />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Terms */}
        <p className="text-xs text-white/35">
          By subscribing you agree to our{" "}
          <a href="/terms" className="text-orange-400 transition hover:text-orange-300">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-orange-400 transition hover:text-orange-300">
            Privacy Policy
          </a>
          .
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-medium text-white/60 transition hover:border-white/25 hover:text-white/80 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="flex-1 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing…
              </span>
            ) : (
              `Subscribe — $${billingInfo.total.toFixed(2)}/mo`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

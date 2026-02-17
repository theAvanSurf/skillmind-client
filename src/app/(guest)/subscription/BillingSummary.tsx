"use client";

import { useState } from "react";

interface PlanType {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
  priceId: string;
}

interface BillingInfo {
  plan: PlanType | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
}

interface BillingSummaryProps {
  billingInfo: BillingInfo;
  onApplyPromo?: (code: string) => void;
}

export default function BillingSummary({
  billingInfo,
  onApplyPromo,
}: BillingSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode.trim() && onApplyPromo) {
      onApplyPromo(promoCode.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Billing Summary</h3>

      {/* Plan details */}
      {billingInfo.plan && (
        <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-gray-800">
                {billingInfo.plan.name}
              </p>
              <p className="text-sm text-gray-600">
                Billed {billingInfo.plan.interval === "month" ? "monthly" : "yearly"}
              </p>
            </div>
            <span className="text-lg font-bold text-purple-600">
              ${billingInfo.plan.price.toFixed(2)}
            </span>
          </div>
          
          {billingInfo.plan.interval === "month" && (
            <p className="text-xs text-gray-500 mt-2">
              Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Promo code */}
      <div className="mb-6">
        {!showPromoInput ? (
          <button
            onClick={() => setShowPromoInput(true)}
            className="text-purple-600 text-sm font-medium hover:underline"
          >
            + Add promo code
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Apply
              </button>
            </div>
            <button
              onClick={() => setShowPromoInput(false)}
              className="text-gray-500 text-xs hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-3 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800 font-medium">
            ${billingInfo.subtotal.toFixed(2)}
          </span>
        </div>

        {billingInfo.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Discount {billingInfo.promoCode && `(${billingInfo.promoCode})`}
            </span>
            <span className="text-green-600 font-medium">
              -${billingInfo.discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (ITBIS 18%)</span>
          <span className="text-gray-800 font-medium">
            ${billingInfo.tax.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-semibold text-gray-800">
            Total due today
          </span>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
              ${billingInfo.total.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {billingInfo.plan?.interval === "month" ? "per month" : "per year"}
            </div>
          </div>
        </div>
      </div>

      {/* Trial info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">7-day free trial included.</span> You
          won't be charged until {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
          Cancel anytime before then.
        </p>
      </div>

      {/* Security badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}

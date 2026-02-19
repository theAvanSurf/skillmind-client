"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

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
    <div className="flex h-full flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">
        Billing Summary
      </h3>

      {/* Plan details */}
      {billingInfo.plan && (
        <div className="rounded-xl border border-white/8 bg-white/4 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{billingInfo.plan.name}</p>
              <p className="text-xs text-white/40">
                Billed {billingInfo.plan.interval === "month" ? "monthly" : "yearly"}
              </p>
            </div>
            <span className="text-base font-bold text-orange-400">
              ${billingInfo.plan.price.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Promo code */}
      <div>
        {!showPromoInput ? (
          <button
            onClick={() => setShowPromoInput(true)}
            className="text-xs font-medium text-orange-400 transition hover:text-orange-300"
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
                className="flex-1 rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-xs text-white placeholder-white/25 outline-none transition focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20"
              />
              <button
                onClick={handleApplyPromo}
                className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
              >
                Apply
              </button>
            </div>
            <button
              onClick={() => setShowPromoInput(false)}
              className="text-xs text-white/35 hover:text-white/60 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-2 border-b border-white/8 pb-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Subtotal</span>
          <span className="text-white">${billingInfo.subtotal.toFixed(2)}</span>
        </div>
        {billingInfo.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-white/50">
              Discount {billingInfo.promoCode && `(${billingInfo.promoCode})`}
            </span>
            <span className="font-medium text-green-400">
              -${billingInfo.discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Tax (ITBIS 18%)</span>
          <span className="text-white">${billingInfo.tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-white">Total due today</span>
        <div className="text-right">
          <div className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-xl font-bold text-transparent">
            ${billingInfo.total.toFixed(2)}
          </div>
          <div className="text-xs text-white/35">
            {billingInfo.plan?.interval === "month" ? "per month" : "per year"}
          </div>
        </div>
      </div>

      {/* Trial info */}
      <div className="rounded-xl border border-orange-500/15 bg-orange-500/8 p-3">
        <p className="text-xs text-white/70">
          <span className="font-semibold text-orange-300">7-day free trial included.</span>{" "}
          You won&apos;t be charged until{" "}
          {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
        </p>
      </div>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-white/30">
        <Lock className="h-3.5 w-3.5" />
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}

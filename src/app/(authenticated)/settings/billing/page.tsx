"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Activity,
  AlertCircle,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface SubscriptionDto {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: string;
  subscriptionStatus: string;
  currentPeriodEnd: string;
  isInGracePeriod: boolean;
  gracePeriodEnd: string | null;
}

const PLAN_FEATURES = [
  "Unlimited course access",
  "AI-powered learning paths",
  "Certificate generation",
  "Priority support",
  "Live sessions",
];

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/payment/subscription");
        if (!res.ok) throw new Error("Failed to load subscription details.");
        const data = await res.json();
        setSubscription(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, []);

  const handleManageBilling = async () => {
    try {
      setPortalLoading(true);
      const res = await fetch("/api/payment/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Failed to access billing portal.");
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        setNotification("Billing portal opened in a new tab.");
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err: any) {
      alert(err.message || "Unable to open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return { label: "Unknown", classes: "bg-gray-500/15 text-gray-400 border-gray-500/20" };
    const s = status.toLowerCase();
    if (s === "active") return { label: "Active", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
    if (s === "trialing") return { label: "Trial", classes: "bg-blue-500/15 text-blue-400 border-blue-500/20" };
    if (s === "past_due" || s === "canceled")
      return { label: status, classes: "bg-red-500/15 text-red-400 border-red-500/20" };
    return { label: status, classes: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" };
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
      </div>
    );
  }

  if (!loading && !error && !subscription) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white">Billing & Payment</h1>
          <p className="mt-2 text-sm text-white/50">Manage your subscription and payment methods.</p>
        </header>
        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#13131e] to-[#0a0a0f] p-16 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mb-5">
            <CreditCard className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
          <p className="text-white/40 text-sm mb-8 max-w-xs">Subscribe to unlock unlimited courses, certificates, and more.</p>
          <a
            href="/register/billing"
            className="px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition"
          >
            View Plans
          </a>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-white/30">
          <ShieldCheck className="h-3.5 w-3.5" />
          <p>Payments secured by Stripe. We never store card details.</p>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(subscription?.subscriptionStatus);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-3.5 text-sm text-emerald-400 shadow-2xl backdrop-blur-xl">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <p>{notification}</p>
        </div>
      )}

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Billing & Payment</h1>
        <p className="mt-2 text-sm text-white/50">Manage your subscription, payment methods, and invoices.</p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 flex flex-col items-center text-center gap-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Could Not Load Subscription</h3>
            <p className="text-white/50 text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Plan Overview — spans 2 cols */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#13131e] via-[#0f0f18] to-[#0a0a0f] p-8 shadow-2xl">
            {/* Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative flex flex-wrap items-start justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-0.5">Current Plan</p>
                  <h2 className="text-2xl font-bold text-white">
                    {subscription?.plan?.includes("Premium") ? "SkillMind Premium" : subscription?.plan || "Premium"}
                  </h2>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs font-semibold capitalize ${badge.classes}`}>
                {badge.label}
              </span>
            </div>

            {/* Stats row */}
            <div className="relative grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl bg-white/3 border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wider">Billing Cycle</span>
                </div>
                <p className="text-base font-semibold text-white">Monthly</p>
              </div>
              <div className="rounded-xl bg-white/3 border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wider">Next Payment</span>
                </div>
                <p className="text-base font-semibold text-white">{formatDate(subscription?.currentPeriodEnd)}</p>
              </div>
            </div>

            {/* Features */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PLAN_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Manage Card — 1 col */}
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#13131e] via-[#0f0f18] to-[#0a0a0f] p-8 shadow-2xl flex flex-col justify-between">
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/8 blur-3xl" />

            <div className="relative mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-6">
                <CreditCard className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Manage Billing</h2>
              <p className="text-sm text-white/40 leading-relaxed">
                Update payment method, download invoices, or change your plan — all via the secure Stripe portal.
              </p>
            </div>

            <div className="relative space-y-3">
              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-60 group"
              >
                {portalLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                    Opening…
                  </>
                ) : (
                  <>
                    Open Portal
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-white/25">Redirects to Stripe's secure portal</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-white/25 pt-2">
        <ShieldCheck className="h-3.5 w-3.5" />
        <p>All payments are securely processed by Stripe. We never store your credit card information.</p>
      </div>
    </div>
  );
}

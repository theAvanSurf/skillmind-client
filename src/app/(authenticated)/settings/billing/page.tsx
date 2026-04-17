"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calendar, ShieldCheck, ArrowRight, Activity, AlertCircle } from "lucide-react";

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
        if (!res.ok) {
          throw new Error("Failed to load subscription details.");
        }
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
        body: JSON.stringify({}), // Empty object since sessionId is not required now
      });

      if (!res.ok) {
        throw new Error("Failed to access billing portal.");
      }

      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        setNotification("We've securely opened your billing details in a new tab!");
        setTimeout(() => setNotification(null), 5000);
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

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    if (status.toLowerCase() === "active") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (status.toLowerCase() === "past_due" || status.toLowerCase() === "canceled") return "bg-red-500/20 text-red-400 border-red-500/30";
    if (status.toLowerCase() === "trialing") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
      </div>
    );
  }

  if (!loading && !error && !subscription) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Billing & Payment</h1>
          <p className="mt-2 text-sm text-white/60">Manage your subscription plan, payment methods, and billing information securely.</p>
        </header>
        <div className="rounded-2xl border border-white/5 bg-linear-to-br from-[#161622] to-[#0A0A0F] p-12 flex flex-col items-center justify-center text-center">
          <CreditCard className="w-12 h-12 text-white/20 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Active Subscription</h3>
          <p className="text-white/50 text-sm mb-6">You don't have an active plan yet. Subscribe to unlock all features.</p>
          <a href="/register/billing" className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition">
            View Plans
          </a>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40">
          <ShieldCheck className="h-4 w-4" />
          <p>All payments are securely processed by Stripe. We do not store your credit card information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/20 px-5 py-4 text-sm text-green-400 shadow-2xl backdrop-blur-xl">
          <ShieldCheck className="h-5 w-5" />
          <p>{notification}</p>
        </div>
      )}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Billing & Payment</h1>
        <p className="mt-2 text-sm text-white/60">
          Manage your subscription plan, payment methods, and billing information securely.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 flex flex-col items-center justify-center text-center">
           <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
           <h3 className="text-lg font-medium text-white mb-2">Could Not Load Subscription</h3>
           <p className="text-white/70 mb-4">{error}</p>
           <button 
             onClick={() => window.location.reload()}
             className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition"
           >
             Try Again
           </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Subscription Overview Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-[#161622] to-[#0A0A0F] p-8 shadow-2xl transition-all hover:border-white/10 hover:shadow-blue-500/5">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">Current Plan</h2>
                  <p className="text-xl font-bold text-white mt-0.5">
                     {subscription?.plan?.includes("Premium") ? "SkillMind Premium" : subscription?.plan || "Unknown Plan"}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(subscription?.subscriptionStatus)}`}>
                {subscription?.subscriptionStatus || "Unknown"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Billing Cycle</span>
                </div>
                <span className="text-sm font-medium text-white">Monthly</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Next Payment</span>
                </div>
                <span className="text-sm font-medium text-white">{formatDate(subscription?.currentPeriodEnd)}</span>
              </div>
            </div>
          </div>

          {/* Manage Billing Action Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-[#161622] to-[#0A0A0F] p-8 shadow-2xl transition-all hover:border-white/10 hover:shadow-purple-500/5 flex flex-col justify-between">
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 mb-6">
                <CreditCard className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Manage Coverage</h2>
              <p className="text-sm text-white/60">
                Update your payment method, download invoices, or modify your billing address safely via the Stripe Portal.
              </p>
            </div>

            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="relative w-full overflow-hidden rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group/btn"
            >
              {portalLoading ? (
                 <span className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                   Opening Portal...
                 </span>
              ) : (
                <>
                  Manage Subscription
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40">
        <ShieldCheck className="h-4 w-4" />
        <p>All payments are securely processed by Stripe. We do not store your credit card information.</p>
      </div>
    </div>
  );
}

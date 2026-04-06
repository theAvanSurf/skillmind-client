"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/features/auth/components/AuthLayout";

type ContinueTarget = "/register/billing" | "/register/profiles" | "/main";

type ContinueState = {
  title: string;
  subtitle: string;
  cta: string;
  target: ContinueTarget;
  chips: string[];
};

type SessionResponse = {
  profiles?: unknown[];
};

type SubscriptionResponse = {
  intendedPlan?: string | null;
  subscriptionStatus?: string | null;
};

const fallbackState: ContinueState = {
  title: "You're all set",
  subtitle: "We could not read your latest progress. Taking you to Home.",
  cta: "Go to Home",
  target: "/main",
  chips: ["Safe fallback"],
};

function decideNextState(subscription: SubscriptionResponse | null, session: SessionResponse | null): ContinueState {
  const status = (subscription?.subscriptionStatus ?? "").toLowerCase();

  if (subscription?.intendedPlan || status === "incomplete" || status === "past_due") {
    return {
      title: "Continue your billing setup",
      subtitle: "You already started a plan. Finish checkout to unlock full access.",
      cta: "Continue billing",
      target: "/register/billing",
      chips: ["Saved progress", "Billing pending"],
    };
  }

  const profilesCount = Array.isArray(session?.profiles) ? session!.profiles!.length : 0;
  if (profilesCount === 0) {
    return {
      title: "Create your first profile",
      subtitle: "Set up your profile so we can personalize your learning experience.",
      cta: "Continue profile setup",
      target: "/register/profiles",
      chips: ["Almost ready", "No profiles yet"],
    };
  }

  return {
    title: "You're all set",
    subtitle: "Everything is complete. Let's go to your Home.",
    cta: "Go to Home",
    target: "/main",
    chips: ["Account ready", "Profiles found"],
  };
}

export default function ContinuePage() {
  const router = useRouter();
  const [state, setState] = useState<ContinueState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const [subscriptionRes, sessionRes] = await Promise.allSettled([
          fetch("/api/payment/subscription", { cache: "no-store" }),
          fetch("/api/sessions", { cache: "no-store" }),
        ]);

        let subscription: SubscriptionResponse | null = null;
        let session: SessionResponse | null = null;

        if (subscriptionRes.status === "fulfilled" && subscriptionRes.value.ok) {
          subscription = (await subscriptionRes.value.json()) as SubscriptionResponse;
        }

        if (sessionRes.status === "fulfilled" && sessionRes.value.ok) {
          session = (await sessionRes.value.json()) as SessionResponse;
        }

        if (!mounted) return;
        setState(decideNextState(subscription, session));
      } catch {
        if (!mounted) return;
        setState(fallbackState);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && state?.target === "/main") {
      router.replace("/main");
    }
  }, [isLoading, router, state]);

  const card = useMemo(() => state ?? fallbackState, [state]);

  return (
    <AuthLayout>
      <div className="text-center">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300/80">
          Continue
        </p>

        <h1 className="text-2xl font-bold text-white">Continue where you left off</h1>
        <p className="mt-2 text-sm text-white/55">{card.subtitle}</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {card.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Next step</p>
          <p className="mt-1 text-base font-semibold text-white">{card.title}</p>
        </div>

        <button
          onClick={() => router.push(card.target)}
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-linear-to-r from-blue-500 to-blue-600 py-3 text-sm font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Checking your progress..." : card.cta}
        </button>
      </div>
    </AuthLayout>
  );
}

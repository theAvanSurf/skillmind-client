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

export type PlanSelection = "free" | "premium" | null;

// ─── Stripe Subscription ────────────────────────────────────────────────────

export type SubscriptionStatus =
  | "Free"
  | "Active"
  | "Trialing"
  | "PastDue"
  | "Suspended"
  | "Canceled"
  | "Deleted";

export type PaymentFailureReason =
  | "InsufficientFunds"
  | "CardDeclined"
  | "NetworkError"
  | "BankDelay"
  | "Expired"
  | "Unknown";

export interface Subscription {
  id: string;
  userId: string;
  intendedPlan: string | null;    // set by backend when create-subscription is called; cleared on payment success
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeLookupKey: string;
  status: string;
  subscriptionStatus: SubscriptionStatus;
  plan: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt: string | null;
  trialEnd: string | null;
  isInGracePeriod: boolean;
  gracePeriodStart: string | null;
  gracePeriodEnd: string | null;
  retryAttemptCount: number;
  nextRetryAt: string | null;
  lastFailureAt: string | null;
  lastFailureReason: PaymentFailureReason | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutSessionResponse {
  clientSecret: string;
}

export interface SubscriptionClientSecretResponse {
  clientSecret: string;   // PaymentIntent secret: "pi_xxx_secret_xxx"
  subscriptionId: string; // Stripe subscription ID "sub_xxx"
}

export interface SessionStatusResponse {
  status: string;
  customerEmail: string;
}

export interface PortalSessionResponse {
  url: string;
}

export const failureReasonLabels: Record<PaymentFailureReason, string> = {
  InsufficientFunds: "Insufficient funds",
  CardDeclined: "Card declined",
  NetworkError: "Network error — please try again",
  BankDelay: "Bank processing delay",
  Expired: "Card expired",
  Unknown: "Payment could not be processed",
};

export function getDaysRemaining(gracePeriodEnd: string): number {
  const end = new Date(gracePeriodEnd);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export type AccessLevel = "full" | "trial" | "free" | "payment-issue" | "blocked";

export function resolveAccess(sub: Subscription): AccessLevel {
  switch (sub.subscriptionStatus) {
    case "Active":    return "full";
    case "Trialing":  return "trial";
    case "Free":      return "free";
    case "PastDue":   return "payment-issue";
    case "Suspended":
    case "Canceled":
    case "Deleted":   return "blocked";
  }
}

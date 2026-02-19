import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("Stripe public key is not configured");
}

export const stripePromise = loadStripe(publishableKey ?? "");

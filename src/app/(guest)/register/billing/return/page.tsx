"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import AuthLayout from "@/features/auth/components/AuthLayout"
import { createUserStorage } from "@/store/create-user-storage"

export default function BillingReturnPage() {
  return (
    <Suspense fallback={
      <AuthLayout step={4} totalSteps={6} title="Confirming payment…">
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      </AuthLayout>
    }>
      <ReturnPageInner />
    </Suspense>
  )
}

function ReturnPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setCompletedStep = createUserStorage((s) => s.setCompletedStep)

  const [status, setStatus] = useState<"loading" | "succeeded" | "processing" | "failed" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret")
    const redirectStatus = searchParams.get("redirect_status")

    // If no clientSecret this page was hit directly — go back
    if (!clientSecret) {
      router.replace("/register/billing")
      return
    }

    // Fast path: Stripe already tells us the result via redirect_status param
    if (redirectStatus === "succeeded") {
      setCompletedStep(5)
      setStatus("succeeded")
      setTimeout(() => router.push("/register/profiles"), 2000)
      return
    }

    // Otherwise confirm via stripe.retrievePaymentIntent for authoritative status
    const confirm = async () => {
      try {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        if (!stripe) throw new Error("Stripe failed to load")

        const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret)

        if (error) {
          setMessage(error.message ?? "Could not retrieve payment status")
          setStatus("error")
          return
        }

        switch (paymentIntent?.status) {
          case "succeeded":
            setCompletedStep(5)
            setStatus("succeeded")
            setTimeout(() => router.push("/register/profiles"), 2000)
            break
          case "processing":
            setStatus("processing")
            break
          case "requires_payment_method":
            setMessage("Your payment was declined. Please try a different card.")
            setStatus("failed")
            break
          default:
            setMessage("Unexpected payment status. Please try again.")
            setStatus("failed")
        }
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Unexpected error")
        setStatus("error")
      }
    }

    confirm()
  }, []) // eslint-disable-line

  return (
    <AuthLayout step={4} totalSteps={6} title="Payment">
      <div className="flex flex-col items-center gap-5 py-12 text-center">
        {status === "loading" ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <div>
              <p className="text-base font-semibold text-white">Confirming your payment…</p>
              <p className="mt-1 text-sm text-white/40">This usually takes just a moment</p>
            </div>
          </>
        ) : status === "succeeded" ? (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            <div>
              <p className="text-base font-semibold text-white">Payment confirmed!</p>
              <p className="mt-2 text-sm text-white/40">Setting up your account…</p>
            </div>
          </>
        ) : status === "processing" ? (
          <>
            <Clock className="h-12 w-12 text-yellow-400" />
            <div>
              <p className="text-base font-semibold text-white">Payment processing</p>
              <p className="mt-1 text-sm text-white/40">
                Your bank is processing the payment. We&apos;ll send you a confirmation email.
              </p>
            </div>
            <button
              onClick={() => router.push("/register/profiles")}
              className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Continue anyway
            </button>
          </>
        ) : (
          <>
            <XCircle className="h-12 w-12 text-red-400" />
            <div>
              <p className="text-base font-semibold text-white">Payment failed</p>
              {message && (
                <p className="mt-1 text-sm text-white/40">{message}</p>
              )}
            </div>
            <button
              onClick={() => router.push("/register/billing")}
              className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

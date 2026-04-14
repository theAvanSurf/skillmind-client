"use client"

import React, { useState } from "react"
import { Loader2, CreditCard, ArrowRight, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import AuthLayout from "../components/AuthLayout"
import { useRegistrationGuard } from "../hooks/useRegistrationGuard"
import { createUserStorage } from "@/store/create-user-storage"
import AuthenticationServices from "@/features/auth/services/auth-services"

const authServices = new AuthenticationServices()

export default function StripeConnectStep() {
  const router = useRouter()
  const setCompletedStep = createUserStorage((s) => s.setCompletedStep)
  const setUserId = createUserStorage((s) => s.setUserId)
  const draft = createUserStorage((s) => s.registrationDraft)
  const userId = createUserStorage((s) => s.userId)
  useRegistrationGuard(7)

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const doSignUp = async () => {
    // Skip signUp if already done — userId is the reliable signal,
    // not completedStep (which reaches 7 before signUp for professors)
    if (userId) {
      router.push("/register/step5")
      return
    }

    setLoading(true)
    setApiError("")
    try {
      const response = await authServices.signUp({
        Name: draft.firstName ?? "",
        LastName: draft.lastName ?? "",
        UserName: draft.userName ?? "",
        Email: draft.email ?? "",
        Password: draft.password ?? "",
        BirthDate: draft.birthDate ?? "",
        PhoneNumber: draft.phone ?? "",
        Country: draft.country ?? "",
        AccountTypes: 0,
        Role: 0,
      })

      if (!response.id) throw new Error("Registration failed. Please try again.")

      setUserId(response.id)
      setCompletedStep(3)
      router.push("/register/step5")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data
        const msg =
          data?.details?.join(", ") ||
          data?.message ||
          err.message ||
          "Something went wrong. Please try again."
        setApiError(msg)
      } else {
        setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout step={4} totalSteps={5} title="Stripe Connect">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Set Up Payouts</h2>
        <p className="mt-1 text-xs text-white/40">
          Connect Stripe to receive earnings from your courses
        </p>
      </div>

      {/* Stripe Connect card */}
      <div className="mb-5 rounded-xl border border-white/8 bg-white/3 p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
            <CreditCard size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Stripe Connect</p>
            <p className="mt-0.5 text-xs text-white/45">
              Industry-standard payment processing. SkillMind takes a 15% platform fee; the rest goes to you.
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-xs text-white/50">
          {[
            "Instant payouts to your bank account",
            "Supports 135+ currencies",
            "1099 tax reporting included",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-blue-400/60" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {apiError && (
        <p className="mb-3 text-center text-xs text-red-400">{apiError}</p>
      )}

      {/* Connect button */}
      <button
        type="button"
        disabled={loading}
        onClick={doSignUp}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all ${
          !loading
            ? "bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700"
            : "cursor-not-allowed bg-white/10 text-white/30"
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Creating account…
          </>
        ) : (
          <>
            <CreditCard size={15} />
            Connect Stripe &amp; Continue
            <ArrowRight size={14} />
          </>
        )}
      </button>

      {/* Skip option */}
      <button
        type="button"
        disabled={loading}
        onClick={doSignUp}
        className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-xs text-white/35 transition hover:text-white/55 disabled:pointer-events-none"
      >
        <Clock size={12} />
        Skip for now — I'll set this up later
      </button>

      <p className="mt-4 text-center text-[11px] text-white/20">
        You can always connect Stripe later from your professor dashboard
      </p>
    </AuthLayout>
  )
}

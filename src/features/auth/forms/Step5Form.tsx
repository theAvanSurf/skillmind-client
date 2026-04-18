"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import AuthLayout from "../components/AuthLayout"
import { useRegistrationGuard } from "../hooks/useRegistrationGuard"
import { createUserStorage } from "@/store/create-user-storage"
import AuthenticationServices from "@/features/auth/services/auth-services"

const authServices = new AuthenticationServices()

const CODE_LENGTH = 6
const RESEND_COOLDOWN = 60

export default function VerificationStep() {
  const router = useRouter()
  const setCompletedStep = createUserStorage((s) => s.setCompletedStep)
  const setUser = createUserStorage((s) => s.setUser)
  const setToken = createUserStorage((s) => s.setToken)
  const userId = createUserStorage((s) => s.userId)
  const draft = createUserStorage((s) => s.registrationDraft)
  const allowed = useRegistrationGuard(3)

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [shake, setShake] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isFilled = code.every((d) => d !== "")

  const maskEmail = (email: string) => {
    if (!email.includes("@")) return email
    const [local, domain] = email.split("@")
    if (local.length <= 2) return `${local[0]}***@${domain}`
    return `${local.slice(0, 2)}***@${domain}`
  }
  const maskedEmail = draft.email ? maskEmail(draft.email) : "***@***.com"

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN)
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    setError("")
    const next = [...code]
    next[index] = value
    setCode(next)
    if (value !== "" && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index] !== "") {
        const next = [...code]
        next[index] = ""
        setCode(next)
        setError("")
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill("")
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setCode(next)
    setError("")
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  const handleVerify = async () => {
    if (!isFilled || loading) return
    setLoading(true)
    setError("")

    try {
      // 1 — Confirm account with OTP
      await authServices.confirmAccount({
        UserId: userId ?? "",
        Code: code.join(""),
      })

      // 2 — Silent login so the user gets a token right away
      const loginResponse = await authServices.login({
        userName: draft.userName ?? draft.email ?? "",
        password: draft.password ?? "",
      })

      // Professor: create the domain profile BEFORE committing local state.
      // If this fails, localStorage has no stale token/user.
      if (draft.role === "professor") {
        try {
          await authServices.createProfessorProfile(
            {
              userId: loginResponse.id || userId || "",
              bio: draft.bio ?? "",
              expertise: draft.expertise ?? "",
              yearsOfExperience: draft.yearsOfExperience ?? 0,
              linkedInUrl: draft.linkedInUrl ?? "",
            },
            loginResponse.jwtToken
          )
        } catch (profileErr) {
          const msg = profileErr instanceof Error
            ? profileErr.message
            : "Could not create professor profile. Please contact support."
          setError(msg)
          setShake(true)
          setTimeout(() => setShake(false), 600)
          return
        }
      }

      // Commit token + user only after all backend work succeeds
      setToken(loginResponse.jwtToken)
      setUser({
        name: loginResponse.name,
        lastName: loginResponse.lastName,
        userName: draft.userName ?? "",
        email: loginResponse.email,
        password: "",
        birthDate: new Date(draft.birthDate ?? ""),
        phoneNumber: draft.phone ?? "",
        country: draft.country ?? "",
        accountTypes: draft.plan === "premium" ? 1 : 0,
        role: draft.role === "professor" ? 0 : 2,
      })

      if (draft.role === "professor") {
        setCompletedStep(6)
        router.push("/professor/dashboard")
        return
      }

      // Student: premium → billing, free → profiles
      if (draft.plan === "premium") {
        setCompletedStep(4)
        router.push("/register/billing")
      } else {
        setCompletedStep(5)
        router.push("/register/profiles")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Incorrect code. Please try again."
      setError(msg)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setCode(Array(CODE_LENGTH).fill(""))
      inputsRef.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return
    setResending(true)
    setError("")
    // TODO: call resend-otp endpoint when available on the backend
    await new Promise((r) => setTimeout(r, 1000))
    setResending(false)
    setCode(Array(CODE_LENGTH).fill(""))
    inputsRef.current[0]?.focus()
    startCooldown()
  }

  const inputCls = error
    ? "h-12 w-12 rounded-xl border border-red-500/50 bg-red-500/[0.06] text-center text-lg font-semibold text-white outline-none transition focus:border-red-500/70 focus:ring-2 focus:ring-red-500/15"
    : "h-12 w-12 rounded-xl border border-white/10 bg-white/[0.06] text-center text-lg font-semibold text-white outline-none transition focus:border-blue-500/50 focus:bg-white/[0.09] focus:ring-2 focus:ring-blue-500/15"

  return (
    <AuthLayout step={4} totalSteps={5} title="Verification">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
        <p className="mt-2 text-sm text-white/45">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-white/70">{maskedEmail}</span>
        </p>
      </div>

      <div
        onPaste={handlePaste}
        className={`mb-2 flex justify-center gap-2.5 transition-all ${shake ? "animate-shake" : ""}`}
      >
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            className={inputCls}
          />
        ))}
      </div>

      {error && (
        <p className="mb-4 text-center text-xs text-red-400">{error}</p>
      )}

      <div className={error ? "" : "mt-4"}>
        <button
          type="button"
          disabled={!isFilled || loading}
          onClick={handleVerify}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            isFilled && !loading
              ? "bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700"
              : "cursor-not-allowed bg-white/10 text-white/30"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Verifying…
            </span>
          ) : (
            "Verify & Continue"
          )}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="mt-4 w-full text-center text-xs text-white/40 transition hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {resending
            ? "Sending…"
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Didn't receive a code? Resend"}
        </button>
      </div>
    </AuthLayout>
  )
}

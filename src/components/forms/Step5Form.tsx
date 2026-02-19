"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AuthLayout from "./AuthLayout"

const CODE_LENGTH = 6
const RESEND_COOLDOWN = 60

export default function VerificationStep() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawEmail = searchParams.get("email") ?? ""

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [error, setError] = useState("")
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
  const maskedEmail = rawEmail ? maskEmail(rawEmail) : "***@***.com"

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

  const handleVerify = () => {
    // Simulate wrong code (any code starting with 0 = invalid, for demo)
    if (code[0] === "0") {
      setError("Incorrect code. Please check your email and try again.")
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setCode(Array(CODE_LENGTH).fill(""))
      inputsRef.current[0]?.focus()
      return
    }
    router.push("/register/welcome")
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return
    setResending(true)
    setError("")
    await new Promise((r) => setTimeout(r, 1200))
    setResending(false)
    setCode(Array(CODE_LENGTH).fill(""))
    inputsRef.current[0]?.focus()
    startCooldown()
  }

  const inputCls = error
    ? "h-12 w-12 rounded-xl border border-red-500/50 bg-red-500/[0.06] text-center text-lg font-semibold text-white outline-none transition focus:border-red-500/70 focus:ring-2 focus:ring-red-500/15"
    : "h-12 w-12 rounded-xl border border-white/10 bg-white/[0.06] text-center text-lg font-semibold text-white outline-none transition focus:border-orange-500/50 focus:bg-white/[0.09] focus:ring-2 focus:ring-orange-500/15"

  return (
    <AuthLayout step={5} totalSteps={5} title="Verification">
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
          disabled={!isFilled}
          onClick={handleVerify}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            isFilled
              ? "bg-linear-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700"
              : "cursor-not-allowed bg-white/10 text-white/30"
          }`}
        >
          Verify &amp; Finish
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
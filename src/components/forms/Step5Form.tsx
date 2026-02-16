"use client"


import React, { useState, useRef } from "react"
import { Brain } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const CODE_LENGTH = 6

export default function Step5Form() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawEmail = searchParams.get("email") || ""

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [resending, setResending] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const maskEmail = (email: string): string => {
    if (!email.includes("@")) return email
    const [local, domain] = email.split("@")
    if (local.length <= 2) return `${local[0]}***@${domain}`
    return `${local.slice(0, 2)}***@${domain}`
  }

  const maskedEmail = rawEmail ? maskEmail(rawEmail) : "***@***.com"

  const isFilled = code.every((digit) => digit !== "")

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const next = [...code]
    next[index] = value
    setCode(next)

    if (value !== "" && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
    if (!pasted) return

    const next = Array(CODE_LENGTH).fill("")
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i]
    }
    setCode(next)

    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  const handleResend = async () => {
    setResending(true)
    // Simulate resend delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setResending(false)
    setCode(Array(CODE_LENGTH).fill(""))
    inputsRef.current[0]?.focus()
  }

  const handleFinish = () => {
    if (!isFilled) return
    // Navigate to the next step or dashboard
    router.push("/welcome")
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 via-gray-100 to-orange-400 flex flex-col px-6">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
            <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-purple-500" />
          </div>
          <span className="text-lg sm:text-xl font-semibold">
            <span className="text-orange-500">Skill</span>
            <span className="text-purple-600">Mind</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center pb-10">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Step info */}
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-900">Step 5 of 5</p>
            <p className="text-xs font-medium text-gray-700 mt-1">
              Client Verification
            </p>
          </div>

          {/* Instruction */}
          <p className="text-sm text-gray-800 text-center mb-6">
            {"Enter the 6 digits code that was send to: "}
            <span className="font-semibold">{maskedEmail}</span>
          </p>

          {/* Code Inputs */}
          <div className="flex items-center justify-center gap-3 mb-8" onPaste={handlePaste}>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Digit ${i + 1} of verification code`}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg border border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 shadow-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
              />
            ))}
          </div>

          {/* Finish Up Button */}
          <button
            type="button"
            disabled={!isFilled}
            onClick={handleFinish}
            className={`w-full max-w-xs rounded-full py-3 text-sm font-medium text-white transition ${
              isFilled
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Finish Up
          </button>

          {/* Resend */}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="mt-4 text-sm text-gray-700 underline-offset-2 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  )
}

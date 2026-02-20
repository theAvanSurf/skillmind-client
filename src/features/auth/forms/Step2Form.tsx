"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import AuthLayout from "../components/AuthLayout"

const schema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number")
      .regex(/[^a-zA-Z0-9]/, "Include at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

const strengthLevels = [
  { score: 1, label: "Very weak", color: "bg-red-500", text: "text-red-400" },
  { score: 2, label: "Weak", color: "bg-blue-500", text: "text-blue-400" },
  { score: 3, label: "Fair", color: "bg-yellow-500", text: "text-yellow-400" },
  { score: 4, label: "Good", color: "bg-blue-400", text: "text-blue-400" },
  { score: 5, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" },
]

function getStrength(pw: string) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^a-zA-Z0-9]/.test(pw)) s++
  if (pw.length >= 12) s++
  return s
}

const field = (error?: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition bg-white/[0.06] focus:bg-white/[0.09] focus:ring-2 ${
    error
      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15"
      : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/15"
  }`

export default function AccountInfoStep() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  })

  const pwValue = watch("password") ?? ""
  const strength = getStrength(pwValue)
  const level = strengthLevels[Math.min(strength - 1, 4)]

  return (
    <AuthLayout step={2} totalSteps={5} title="Account Information">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Account Information</h2>
        <p className="mt-1 text-xs text-white/40">Set up your login credentials</p>
      </div>

      <form onSubmit={handleSubmit(() => router.push("/register/step3"))} className="space-y-3" noValidate>
        {/* Email */}
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className={field(!!errors.email)}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="Create a password"
              autoComplete="new-password"
              className={`${field(!!errors.password)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Strength bar */}
          {pwValue.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      strength >= i ? (level?.color ?? "bg-white/20") : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              {level && (
                <p className={`text-xs ${level.text}`}>{level.label} password</p>
              )}
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              autoComplete="new-password"
              className={`${field(!!errors.confirmPassword)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            isValid
              ? "bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700"
              : "cursor-not-allowed bg-white/10 text-white/30"
          }`}
        >
          Continue
        </button>
      </form>
    </AuthLayout>
  )
}

"use client"

import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import PhoneInput, { isValidPhoneNumber, getCountries } from "react-phone-number-input"
import en from "react-phone-number-input/locale/en.json"
import "react-phone-number-input/style.css"
import AuthLayout from "./AuthLayout"

const today = new Date()
const maxBirthDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
const minBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())

const schema = z.object({
  firstName: z
    .string()
    .min(2, "At least 2 characters")
    .max(50, "Max 50 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Letters only"),
  lastName: z
    .string()
    .min(2, "At least 2 characters")
    .max(50, "Max 50 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Letters only"),
  birthDate: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => {
      const d = new Date(v)
      return !isNaN(d.getTime()) && d <= maxBirthDate && d >= minBirthDate
    }, "You must be at least 13 years old"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((v) => isValidPhoneNumber(v), "Enter a valid phone number"),
  country: z.string().min(1, "Please select your country"),
})

type FormData = z.infer<typeof schema>

const countries = getCountries()
const countryNames = en as Record<string, string>

const field = (error?: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition bg-white/[0.06] focus:bg-white/[0.09] focus:ring-2 ${
    error
      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15"
      : "border-white/10 focus:border-orange-500/50 focus:ring-orange-500/15"
  }`

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-1 text-xs text-red-400">{msg}</p> : null

export default function PersonalInfoStep() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  })

  return (
    <AuthLayout step={1} totalSteps={5} title="Personal Information">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Personal Information</h2>
        <p className="mt-1 text-xs text-white/40">Tell us about yourself to get started</p>
      </div>

      <form onSubmit={handleSubmit(() => router.push("/register/step2"))} className="space-y-3" noValidate>
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register("firstName")}
              type="text"
              placeholder="First Name"
              autoComplete="given-name"
              className={field(!!errors.firstName)}
            />
            <FieldError msg={errors.firstName?.message} />
          </div>
          <div>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              autoComplete="family-name"
              className={field(!!errors.lastName)}
            />
            <FieldError msg={errors.lastName?.message} />
          </div>
        </div>

        {/* Birth date */}
        <div>
          <input
            {...register("birthDate")}
            type="date"
            max={maxBirthDate.toISOString().split("T")[0]}
            min={minBirthDate.toISOString().split("T")[0]}
            className={`${field(!!errors.birthDate)} scheme-dark`}
          />
          <FieldError msg={errors.birthDate?.message} />
        </div>

        {/* Phone with country flag */}
        <div>
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                international
                defaultCountry="US"
                value={value}
                onChange={onChange}
                className={`phone-dark ${errors.phone ? "phone-dark--error" : ""}`}
              />
            )}
          />
          <FieldError msg={errors.phone?.message} />
        </div>

        {/* Country */}
        <div>
          <select
            {...register("country")}
            className={`${field(!!errors.country)} scheme-dark`}
          >
            <option value="">Country of Residency</option>
            {countries.map((code) => (
              <option key={code} value={code}>
                {countryNames[code] ?? code}
              </option>
            ))}
          </select>
          <FieldError msg={errors.country?.message} />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`mt-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            isValid
              ? "bg-linear-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700"
              : "cursor-not-allowed bg-white/10 text-white/30"
          }`}
        >
          Continue
        </button>
      </form>
    </AuthLayout>
  )
}

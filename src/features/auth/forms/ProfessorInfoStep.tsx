"use client"

import React from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Linkedin } from "lucide-react"
import AuthLayout from "../components/AuthLayout"
import { useRegistrationGuard } from "../hooks/useRegistrationGuard"
import { createUserStorage } from "@/store/create-user-storage"

const schema = z.object({
  bio: z
    .string()
    .min(20, "At least 20 characters — tell students who you are")
    .max(500, "Max 500 characters"),
  expertise: z
    .string()
    .min(2, "At least 2 characters")
    .max(150, "Max 150 characters"),
  yearsOfExperience: z
    .coerce
    .number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(60, "Max 60 years"),
  linkedInUrl: z
    .string()
    .url("Enter a valid URL")
    .refine((v) => v.includes("linkedin.com"), "Must be a LinkedIn URL")
    .or(z.literal("")),
})

type FormData = z.infer<typeof schema>

const field = (error?: boolean) =>
  `w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition bg-white/[0.06] focus:bg-white/[0.09] focus:ring-2 ${
    error
      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15"
      : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/15"
  }`

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="mt-1 text-xs text-red-400">{msg}</p> : null

export default function ProfessorInfoStep() {
  const router = useRouter()
  const setCompletedStep = createUserStorage((s) => s.setCompletedStep)
  const setRegistrationDraft = createUserStorage((s) => s.setRegistrationDraft)
  const draft = createUserStorage((s) => s.registrationDraft)
  useRegistrationGuard(2)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    mode: "onTouched",
    defaultValues: {
      bio: draft.bio ?? "",
      expertise: draft.expertise ?? "",
      yearsOfExperience: draft.yearsOfExperience ?? 0,
      linkedInUrl: draft.linkedInUrl ?? "",
    },
  })

  return (
    <AuthLayout step={3} totalSteps={5} title="Professor Profile">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Your Teaching Profile</h2>
        <p className="mt-1 text-xs text-white/40">
          Help students understand your background and expertise
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => {
          setRegistrationDraft({
            bio: data.bio,
            expertise: data.expertise,
            yearsOfExperience: data.yearsOfExperience,
            linkedInUrl: data.linkedInUrl,
          })
          setCompletedStep(7)
          router.push("/register/stripe-connect")
        })}
        className="space-y-4"
        noValidate
      >
        {/* Bio */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/35">
            About You
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="I'm an expert in software architecture with 10+ years building scalable systems…"
            className={`${field(!!errors.bio)} resize-none`}
          />
          <FieldError msg={errors.bio?.message} />
        </div>

        {/* Expertise */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/35">
            Areas of Expertise
          </label>
          <input
            {...register("expertise")}
            type="text"
            placeholder="e.g. React, System Design, TypeScript, AWS"
            className={field(!!errors.expertise)}
          />
          <FieldError msg={errors.expertise?.message} />
          <p className="mt-1 text-[11px] text-white/25">Comma-separated skills or topics</p>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/35">
            Years of Experience
          </label>
          <input
            {...register("yearsOfExperience", { valueAsNumber: true })}
            type="number"
            min={0}
            max={60}
            placeholder="0"
            className={`${field(!!errors.yearsOfExperience)} scheme-dark`}
          />
          <FieldError msg={errors.yearsOfExperience?.message} />
        </div>

        {/* LinkedIn URL (optional) */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/35">
            <Linkedin size={12} />
            LinkedIn Profile
            <span className="normal-case tracking-normal text-white/20">(optional)</span>
          </label>
          <input
            {...register("linkedInUrl")}
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            className={field(!!errors.linkedInUrl)}
          />
          <FieldError msg={errors.linkedInUrl?.message} />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push("/register/step2")}
            className="rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/60 transition-all hover:border-white/20 hover:text-white/90"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`rounded-xl py-3 text-sm font-semibold text-white transition-all ${
              isValid
                ? "bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700"
                : "cursor-not-allowed bg-white/10 text-white/30"
            }`}
          >
            Continue
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}

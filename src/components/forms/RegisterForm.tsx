"use client"

import React, { useState } from "react"
import { Brain } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PersonalInfoStep() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    birthDate: "",
    phone: "",
    country: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const isFormValid = Object.values(form).every(
    value => value.trim() !== ""
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 via-gray-100 to-orange-400 flex flex-col px-6 pt-6">
      
      {/* Logo */}
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
      <div className="w-full max-w-md mx-auto">

        {/* Step info */}
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-gray-900">Step 1 of 5</p>
          <p className="text-xs text-gray-600 mt-1">Personal Information</p>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Name"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm"
          />

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            type="text"
            placeholder="Last Name"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm"
          />

          <input
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            type="date"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Phone Number"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm"
          />

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            type="text"
            placeholder="Country of Residency"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm"
          />
        </div>

        {/* Button */}
        <button
          disabled={!isFormValid}
          onClick={() => router.push("/register/step2")}
          className={`mt-6 w-full rounded-full py-3 text-sm font-medium text-white transition
            ${
              isFormValid
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

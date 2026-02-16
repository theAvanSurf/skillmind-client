"use client"

import React, { useState } from "react"
import { Brain } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Step3Form() {
  const router = useRouter()

  const [profiles, setProfiles] = useState<string[]>(["", "", "", "", ""])

  const handleChange = (index: number, value: string) => {
    const updated = [...profiles]
    updated[index] = value
    setProfiles(updated)
  }

  const isFormValid = profiles.some((p) => p.trim() !== "")

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
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
        
          {/* Step info */}
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-gray-900">Step 3 of 5</p>
            <p className="text-xs font-medium text-gray-700 mt-1">Profiles Creation</p>
            <p className="text-xs text-gray-500 mt-1">
              You can create up to 5 profiles. Dont worry—you can edit or delete them anytime.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            {profiles.map((profile, index) => (
              <input
                key={index}
                value={profile}
                onChange={(e) => handleChange(index, e.target.value)}
                type="text"
                placeholder="Profile Name"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ))}
          </div>

          {/* Button */}
          <button
            disabled={!isFormValid}
            onClick={() => router.push("/register/step-4")}
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
    </div>
  )
}

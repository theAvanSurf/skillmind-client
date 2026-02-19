"use client"

import { Brain } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WelcomeScreen() {
  const router = useRouter()

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
      <div className="flex-1 flex flex-col items-center justify-center pb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center text-balance">
          Welcome, To the SkillMind Family
        </h1>

        <p className="mt-4 text-base sm:text-lg font-medium text-gray-800 text-center">
          Happy Learning!
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-8 w-full max-w-xs rounded-full bg-purple-500 py-3 text-sm font-medium text-white transition hover:bg-purple-600"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

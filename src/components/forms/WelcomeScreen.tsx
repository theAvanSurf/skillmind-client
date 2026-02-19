"use client"

import { Brain } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <div className="fixed inset-0 flex flex-col bg-[#07071a] overflow-hidden">
      {/* Atmospheric glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-150 w-150 rounded-full bg-purple-700/20 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-125 w-125 rounded-full bg-orange-600/15 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-6 w-6 text-orange-500" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-purple-500" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-orange-400">Skill</span>
            <span className="text-white">Mind</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Icon badge */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 shadow-lg shadow-orange-500/10">
          <Brain className="h-10 w-10 text-orange-400" />
        </div>

        <h1 className="max-w-sm text-4xl font-bold leading-tight text-white text-balance">
          Welcome to the{" "}
          <span className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            SkillMind
          </span>{" "}
          Family
        </h1>

        <p className="mt-4 text-base text-white/50">
          Your learning journey starts now. Happy learning!
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-10 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/50"
        >
          Start Exploring Courses! :)
        </button>
      </div>
    </div>
  )
}

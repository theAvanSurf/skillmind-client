"use client"

import Link from "next/link"

interface Action {
  text: string
  href: string
}

interface CoursePromoProps {
  title: string
  description: string
  primaryAction: Action
  secondaryAction: Action
  accentColor?: "blue" | "purple" | "sky" | "indigo"
  showBadge?: boolean
  badgeText?: string
}

const accentMap = {
  blue: {
    badge: "bg-blue-500/20 text-blue-300",
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    glow: "from-blue-600/20 to-transparent",
    border: "border-blue-500/20",
  },
  purple: {
    badge: "bg-purple-500/20 text-purple-300",
    primary: "bg-purple-600 hover:bg-purple-500 text-white",
    glow: "from-purple-600/20 to-transparent",
    border: "border-purple-500/20",
  },
  sky: {
    badge: "bg-sky-500/20 text-sky-300",
    primary: "bg-sky-600 hover:bg-sky-500 text-white",
    glow: "from-sky-600/20 to-transparent",
    border: "border-sky-500/20",
  },
  indigo: {
    badge: "bg-indigo-500/20 text-indigo-300",
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
    glow: "from-indigo-600/20 to-transparent",
    border: "border-indigo-500/20",
  },
}

export default function CoursePromo({
  title,
  description,
  primaryAction,
  secondaryAction,
  accentColor = "blue",
  showBadge = false,
  badgeText = "New",
}: CoursePromoProps) {
  const accent = accentMap[accentColor]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${accent.border} bg-[#1e1e2e] p-6 md:p-8`}
    >
      {/* Glow blob */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-linear-to-br ${accent.glow} blur-3xl`}
      />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2">
            {showBadge && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${accent.badge}`}>
                {badgeText}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-white/50">{description}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={primaryAction.href}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${accent.primary}`}
          >
            {primaryAction.text}
          </Link>
          <Link
            href={secondaryAction.href}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
          >
            {secondaryAction.text}
          </Link>
        </div>
      </div>
    </div>
  )
}

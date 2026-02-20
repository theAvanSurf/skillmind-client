"use client"

import React from "react"
import { Brain } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  step?: number
  totalSteps?: number
  title?: string
  subtitle?: string
  wide?: boolean
}

export default function AuthLayout({
  children,
  step,
  totalSteps = 5,
  title,
  subtitle,
  wide = false,
}: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 flex flex-col overflow-auto bg-[#0a0a0f] auth-scroll">
      {/* Atmospheric glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 top-0 h-150 w-150 rounded-full bg-blue-900/20 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-125 w-125 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-100 w-100 -translate-x-1/2 rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 shrink-0 px-6 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-6 w-6 text-blue-500" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-indigo-500" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-blue-400">Skill</span>
            <span className="text-white">Mind</span>
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-6">
        <div className={`w-full ${wide ? "max-w-3xl" : "max-w-md"}`}>
          {/* Step progress indicator */}
          {step && (
            <div className="mb-5 px-1">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-blue-400/80">
                  Step {step} of {totalSteps}
                </span>
                {title && (
                  <span className="text-[11px] font-medium text-white/35">{title}</span>
                )}
              </div>
              {/* Segmented progress bar */}
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.75 flex-1 rounded-full transition-all duration-500 ${
                      i < step
                        ? "bg-linear-to-r from-blue-500 to-sky-400"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              {subtitle && (
                <p className="mt-2 text-[11px] text-white/35">{subtitle}</p>
              )}
            </div>
          )}

          {/* Glassmorphism card */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

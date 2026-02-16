"use client"

import React, { useState } from "react"
import { Brain, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const freePlanFeatures = [
  "Up to five users profiles",
  "Acceso en 2 dispositivos simultáneamente",
  "Acceso completo a todos los cursos",
  "Seguimiento de progreso básico",
  "Participación en comunidad y foros",
  "Calidad de video estándar",
  "Recomendaciones con Machine Learning",
]

const premiumPlanFeatures = [
  "Up to five users profiles",
  "Acceso en 4 dispositivos simultáneamente",
  "Estadísticas detalladas de progreso",
  "Calidad de video HD o 4K",
  "Descarga de cursos para uso offline",
  "Marcadores y listas de favoritos",
  "Notas personales por curso",
  "Alertas y recordatorios personalizados",
  "Pantalla dividida multi-screen",
]

type Plan = "free" | "premium" | null

export default function Step4Form() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null)

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
        <div className="w-full max-w-2xl">
          {/* Step info */}
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-900">Step 4 of 5</p>
            <p className="text-xs font-medium text-gray-700 mt-1">
              Select your Prefered Plan
            </p>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Free Plan */}
            <button
              type="button"
              onClick={() => setSelectedPlan("free")}
              className={`rounded-xl bg-white p-6 text-left shadow-sm transition-all ${
                selectedPlan === "free"
                  ? "ring-2 ring-purple-500 shadow-md"
                  : "ring-1 ring-gray-200 hover:shadow-md"
              }`}
            >
              <h3 className="text-lg font-semibold text-orange-500 mb-4">
                Free Plan
              </h3>
              <ul className="space-y-2.5">
                {freePlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </button>

            {/* Premium Plan */}
            <button
              type="button"
              onClick={() => setSelectedPlan("premium")}
              className={`rounded-xl bg-white p-6 text-left shadow-sm transition-all ${
                selectedPlan === "premium"
                  ? "ring-2 ring-purple-500 shadow-md"
                  : "ring-1 ring-gray-200 hover:shadow-md"
              }`}
            >
              <h3 className="text-lg font-semibold text-orange-500 mb-4">
                Premium Plan
              </h3>
              <ul className="space-y-2.5">
                {premiumPlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          </div>

          {/* Continue Button */}
          <button
            disabled={!selectedPlan}
            onClick={() => router.push("/register/step-5")}
            className={`mt-8 w-full rounded-full py-3 text-sm font-medium text-white transition ${
              selectedPlan
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

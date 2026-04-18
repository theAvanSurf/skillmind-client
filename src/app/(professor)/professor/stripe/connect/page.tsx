"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { professorKeys } from "@/features/professor/hooks/useProfessor"
import { CreditCard, Loader2 } from "lucide-react"

export default function ProfessorStripeConnectPage() {
  const router = useRouter()
  const qc = useQueryClient()

  useEffect(() => {
    qc.invalidateQueries({ queryKey: professorKeys.stripeStatus })
    router.replace("/professor/earnings")
  }, [qc, router])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
          <CreditCard size={24} />
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Finishing setup, redirecting...</span>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Suspense, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

function CallbackInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const called = useRef(false)

    useEffect(() => {
        if (called.current) return
        called.current = true

        const code = searchParams.get("code")
        const error = searchParams.get("error")

        if (error || !code) {
            router.replace("/professor/streaming?youtube=error")
            return
        }

        fetch("/api/professor/livestreams/oauth/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        })
            .then((res) => {
                if (res.ok) router.replace("/professor/streaming?youtube=connected")
                else router.replace("/professor/streaming?youtube=error")
            })
            .catch(() => router.replace("/professor/streaming?youtube=error"))
    }, [router, searchParams])

    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-3 text-white/60">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Connecting YouTube account...</span>
            </div>
        </div>
    )
}

export default function YouTubeCallbackPage() {
    return (
        <Suspense>
            <CallbackInner />
        </Suspense>
    )
}

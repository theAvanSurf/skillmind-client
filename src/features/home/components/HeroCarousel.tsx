"use client"

import { useEffect, useRef, useState } from "react"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import type { RecommendedCourse } from "@/types/recommendations.types"

interface Props {
  slides: RecommendedCourse[]
  onPlay: (courseId: string, category?: string) => void
}

export default function HeroCarousel({ slides, onPlay }: Props) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, 6000)
  }

  useEffect(() => {
    if (slides.length < 2) return
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, slides.length])

  const prev = () => { setCurrent((c) => (c - 1 + slides.length) % slides.length); resetTimer() }
  const next = () => { setCurrent((c) => (c + 1) % slides.length); resetTimer() }

  if (!slides.length) return null

  const slide = slides[current]

  return (
    <div className="relative overflow-hidden bg-black" style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", height: "min(58vw, 520px)" }}>
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.thumbnail_url || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80"}
            alt={s.title}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Gradients */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-[#181823] via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 pb-10 lg:px-14 max-w-2xl">
        {slide.category && (
          <span className="mb-2 inline-block w-fit rounded-full bg-blue-500/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-blue-300">
            {slide.category}
          </span>
        )}
        <h1
          key={slide.id}
          className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl transition-all duration-500"
          style={{ textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}
        >
          {slide.title}
        </h1>
        {slide.reason && (
          <p className="mt-2 text-sm text-white/65 line-clamp-2">{slide.reason}</p>
        )}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => onPlay(slide.id, slide.category)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white/88 active:scale-95"
          >
            <Play size={15} fill="black" /> Start learning
          </button>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetTimer() }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/35"}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

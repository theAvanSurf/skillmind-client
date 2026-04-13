"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { heroSlides } from "../mock-data"

type Slide = (typeof heroSlides)[number]

interface HeroBannerProps {
  slides: Slide[]
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const router = useRouter()

  const go = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1)
      setCurrent(idx)
    },
    [current]
  )

  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, go, slides.length])
  const next = useCallback(() => go((current + 1) % slides.length), [current, go, slides.length])

  useEffect(() => {
    const t = setTimeout(next, 6000)
    return () => clearTimeout(t)
  }, [next])

  const slide = slides[current]

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "4%" : "-4%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-4%" : "4%", opacity: 0 }),
  }

  return (
    <div className="relative h-[44vh] min-h-75 w-full overflow-hidden sm:h-[60vh] sm:min-h-100 lg:h-[68vh]">
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
          <div className={cn("absolute inset-0 bg-linear-to-r", slide.gradient)} />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-5 sm:max-w-lg sm:p-8 md:max-w-2xl md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            >
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-400 ring-1 ring-blue-500/30 backdrop-blur-sm">
                {slide.badge} · {slide.category}
              </span>
              <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-2 hidden text-sm leading-relaxed text-white/60 sm:mt-3 sm:block md:text-base">
                {slide.subtitle}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => router.push(`/courses/${slide.id}`)}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-white/90 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  <Play className="h-4 w-4 fill-black" />
                  Watch Now
                </button>
                <button
                  onClick={() => router.push(`/courses/${slide.id}`)}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  <Info className="h-4 w-4" />
                  More Info
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white sm:left-3 sm:p-2.5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white/70 backdrop-blur-sm transition hover:bg-black/70 hover:text-white sm:right-3 sm:p-2.5"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </div>
  )
}
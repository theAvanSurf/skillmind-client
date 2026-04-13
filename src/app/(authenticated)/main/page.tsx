"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTracking } from "@/features/tracking/hooks/useTracking"
import type { RecommendationResponse, RecommendedCourse } from "@/types/recommendations.types"
import Recommendations from "@/features/home/components/Recommendations"
import HeroCarousel from "@/features/home/components/HeroCarousel"
import { motion } from "framer-motion"
import { TrendingUp, Loader2 } from "lucide-react"

export default function MainPage() {
  const router = useRouter()
  const { trackEvent } = useTracking()

  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([])
  const [isPersonalized, setIsPersonalized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recommendations")
      .then(res => res.json())
      .then((data: RecommendationResponse) => {
        if (data.recommendations) {
          setRecommendations(data.recommendations)
          setIsPersonalized(data.is_personalized)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const goToCourse = (courseId: string, category?: string) => {
    trackEvent(courseId, "clicked", category)
    router.push(`/courses/${courseId}`)
  }

  // Use top 5 recommendations as carousel slides
  const heroSlides = recommendations.slice(0, 5)

  return (
    <main className="min-h-screen w-full space-y-10 py-8">

      {/* ── HERO CAROUSEL ─────────────────────────────────────────────────── */}
      {isLoading ? (
        <div
          className="-mx-4 sm:-mx-6 lg:-mx-10 animate-pulse bg-white/8"
          style={{ height: "min(58vw, 520px)" }}
        />
      ) : heroSlides.length > 0 ? (
        <HeroCarousel slides={heroSlides} onPlay={goToCourse} />
      ) : (
        <div
          className="-mx-4 sm:-mx-6 lg:-mx-10 flex flex-col items-center justify-center text-center px-6 bg-white/4"
          style={{ height: "min(58vw, 340px)" }}
        >
          <TrendingUp className="mb-4 h-12 w-12 text-white/20" />
          <h1 className="text-2xl font-bold text-white">Welcome to SkillMind</h1>
          <p className="mt-2 text-sm text-white/50">Your personalized recommendations will appear here as you learn.</p>
        </div>
      )}

      {/* ── RECOMMENDATIONS ───────────────────────────────────────────────── */}
      {isLoading ? (
        <section className="space-y-3">
          <div className="h-6 w-48 animate-pulse rounded-lg bg-white/8" />
          <div className="flex gap-4 overflow-hidden">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-52 w-40 flex-none animate-pulse rounded-xl bg-white/6 sm:w-48" />
            ))}
          </div>
        </section>
      ) : recommendations.length > 0 ? (
        <Recommendations
          items={recommendations}
          subtitle={isPersonalized ? "Based on your unique learning history" : "Trending right now on SkillMind"}
          onCourseClick={goToCourse}
        />
      ) : (
        <section className="rounded-2xl border border-white/8 bg-white/4 p-8 text-center">
          <TrendingUp className="mx-auto mb-3 h-8 w-8 text-white/25" />
          <p className="text-sm font-semibold text-white/60">No recommendations yet</p>
          <p className="mt-1 text-xs text-white/35">Start exploring courses and we'll personalise your feed.</p>
        </section>
      )}

      {/* ── ALL RECOMMENDED (rest of list, excluding hero) ────────────────── */}
      {!isLoading && recommendations.length > 1 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">More for you</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {recommendations.slice(1).map((course, i) => (
              <motion.button
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => goToCourse(course.id, course.category)}
                className="group overflow-hidden rounded-xl border border-white/8 bg-white/4 text-left transition hover:-translate-y-1 hover:border-white/20"
              >
                <img
                  src={course.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"}
                  alt={course.title}
                  className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                />
                <div className="p-2.5">
                  {course.category && (
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-blue-300">{course.category}</p>
                  )}
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-white">{course.title}</p>
                  {course.relevance_score > 0 && (
                    <p className="mt-1 text-[0.65rem] text-green-400">
                      {(course.relevance_score * 100).toFixed(0)}% match
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
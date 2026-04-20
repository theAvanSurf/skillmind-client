"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useTracking } from "@/features/tracking/hooks/useTracking"
import type { RecommendationResponse, RecommendedCourse } from "@/types/recommendations.types"
import Recommendations from "@/features/home/components/Recommendations"
import HeroCarousel from "@/features/home/components/HeroCarousel"
import { motion } from "framer-motion"
import { TrendingUp, Play, Clock, Sparkles } from "lucide-react"
import { browseCourses } from "@/features/courses/services/browse-courses.service"
import type { BrowseCourseDto } from "@/features/courses/types/course.types"

interface EnrolledCourse {
  id: string
  title: string
  thumbnailUrl: string
  category?: string
  progressPercent: number
  enrolledAt: string
  lastLessonId?: string
  lastLessonTitle?: string
  lastLessonDurationSeconds?: number
  lastTimestampSeconds?: number
}

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

export default function MainPage() {
  const router = useRouter()
  const { trackEvent } = useTracking()

  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([])
  const [isPersonalized, setIsPersonalized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [inProgress, setInProgress] = useState<EnrolledCourse[]>([])
  const [newCourses, setNewCourses] = useState<BrowseCourseDto[]>([])

  const fetchDynamic = useCallback(() => {
    fetch("/api/courses/my-enrollments/in-progress")
      .then(res => res.json())
      .then((data: EnrolledCourse[]) => { if (Array.isArray(data)) setInProgress(data) })
      .catch(console.error)
  }, [])

  // Refetch when tab becomes visible or when course player saves progress
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") fetchDynamic() }
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("skillmind:progress-updated", fetchDynamic)
    return () => {
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("skillmind:progress-updated", fetchDynamic)
    }
  }, [fetchDynamic])

  useEffect(() => {
    // Recommendations
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

    fetchDynamic()

    // New courses
    browseCourses({ sort: "newest", pageSize: 8, page: 0 })
      .then(res => setNewCourses(res.courses))
      .catch(console.error)
  }, [])

  const goToCourse = (courseId: string, category?: string) => {
    trackEvent(courseId, "clicked", category)
    router.push(`/courses/${courseId}`)
  }

  const resumeCourse = (courseId: string, category?: string) => {
    trackEvent(courseId, "started", category)
    router.push(`/my-courses/${courseId}`)
  }

  const heroSlides = recommendations.slice(0, 5)

  return (
    <main className="min-h-screen w-full space-y-12 pb-8">

      {/* ── HERO CAROUSEL ─────────────────────────────────────────────────── */}
      {isLoading ? (
        <div
          className="animate-pulse bg-white/8"
          style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", height: "min(58vw, 520px)" }}
        />
      ) : heroSlides.length > 0 ? (
        <HeroCarousel slides={heroSlides} onPlay={goToCourse} />
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center px-6 bg-white/4"
          style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", height: "min(58vw, 340px)" }}
        >
          <TrendingUp className="mb-4 h-12 w-12 text-white/20" />
          <h1 className="text-2xl font-bold text-white">Welcome to SkillMind</h1>
          <p className="mt-2 text-sm text-white/50">Your personalized recommendations will appear here as you learn.</p>
        </div>
      )}

      {/* ── CONTINUE WATCHING ─────────────────────────────────────────────── */}
      {inProgress.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Continue Watching</h2>
              <p className="text-xs text-white/40 mt-0.5">Pick up right where you left off</p>
            </div>
            <button
              onClick={() => router.push("/my-courses")}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {inProgress.map((course, i) => {
              const savedTime = course.lastTimestampSeconds ?? 0
              const lessonPct = savedTime > 0 && course.lastLessonDurationSeconds && course.lastLessonDurationSeconds > 0
                ? Math.min((savedTime / course.lastLessonDurationSeconds) * 100, 100)
                : null
              const remaining = course.lastLessonDurationSeconds && savedTime > 0
                ? Math.max(course.lastLessonDurationSeconds - savedTime, 0)
                : null

              return (
                <motion.button
                  key={course.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  onClick={() => resumeCourse(course.id, course.category)}
                  className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/4 text-left transition hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="relative aspect-video overflow-hidden bg-black/40">
                    <img
                      src={course.thumbnailUrl || ""}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
                        <Play size={16} fill="black" className="text-black ml-0.5" />
                      </div>
                    </div>
                    {/* Lesson-level bar (falls back to course % if no timestamp) */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${lessonPct ?? course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    {course.category && (
                      <p className="text-[0.6rem] font-bold uppercase tracking-wider text-blue-300">{course.category}</p>
                    )}
                    <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-white">{course.title}</p>
                    {course.lastLessonTitle && (
                      <p className="mt-0.5 line-clamp-1 text-[0.68rem] text-white/50">{course.lastLessonTitle}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Clock size={10} className="text-white/30 shrink-0" />
                      <span className="text-[0.65rem] text-white/40">
                        {remaining !== null && remaining > 0
                          ? `${fmtTime(remaining)} left`
                          : `${course.progressPercent}% complete`}
                      </span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>
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

      {/* ── MORE FOR YOU ─────────────────────────────────────────────────── */}
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

      {/* ── NEW ON SKILLMIND ─────────────────────────────────────────────── */}
      {newCourses.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              <div>
                <h2 className="text-lg font-bold text-white">New on SkillMind</h2>
                <p className="text-xs text-white/40 mt-0.5">Recently added courses</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/courses?sort=newest")}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {newCourses.map((course, i) => (
              <motion.button
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => goToCourse(course.id, course.category)}
                className="group overflow-hidden rounded-xl border border-white/8 bg-white/4 text-left transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative aspect-video overflow-hidden bg-black/40">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Sparkles size={28} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 rounded-full bg-purple-600/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    New
                  </div>
                </div>
                <div className="p-2.5">
                  {course.category && (
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-purple-300">{course.category}</p>
                  )}
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-white">{course.title}</p>
                  <p className="mt-1 text-[0.65rem] text-white/35">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}

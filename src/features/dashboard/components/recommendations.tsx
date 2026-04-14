"use client"

import { Clock, BookOpen } from "lucide-react"

interface RecommendedCourse {
  id: string
  title: string
  duration: string
  category: string
}

interface RecommendationsProps {
  title?: string
  subtitle?: string
  courses: RecommendedCourse[]
  onCourseClick?: (courseId: string) => void
}

const categoryColors: Record<string, string> = {
  Frontend: "text-blue-400 bg-blue-400/10",
  Backend: "text-green-400 bg-green-400/10",
  Design: "text-pink-400 bg-pink-400/10",
  DevOps: "text-yellow-400 bg-yellow-400/10",
  Mobile: "text-sky-400 bg-sky-400/10",
  default: "text-indigo-400 bg-indigo-400/10",
}

export default function Recommendations({
  title = "Recommended For You",
  subtitle,
  courses,
  onCourseClick,
}: RecommendationsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-white/40">{subtitle}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const colorClass = categoryColors[course.category] ?? categoryColors.default
          return (
            <div
              key={course.id}
              className="group cursor-pointer rounded-xl border border-white/6 bg-[#1e1e2e] p-4 transition hover:border-white/10 hover:bg-[#22223a]"
              onClick={() => onCourseClick?.(String(course.id))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onCourseClick?.(String(course.id))
                }
              }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colorClass}`}>
                  {course.category}
                </span>
              </div>
              <p className="mb-2 text-sm font-semibold leading-snug text-white group-hover:text-blue-300 transition-colors">
                {course.title}
              </p>
              <div className="flex items-center gap-3 text-white/40">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span className="text-xs">Enroll</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

"use client"

import { Play, Clock } from "lucide-react"

interface Course {
  id: number
  title: string
  duration: string
}

interface ContinueLearningProps {
  title?: string
  subtitle?: string
  courses: Course[]
  onCourseClick?: (courseId: string) => void
}

export default function ContinueLearning({
  title = "Continue Learning",
  subtitle,
  courses,
  onCourseClick,
}: ContinueLearningProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-white/40">{subtitle}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group flex items-center gap-4 rounded-xl border border-white/6 bg-[#1e1e2e] p-4 transition hover:border-white/10 hover:bg-[#22223a]"
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
            {/* Play button */}
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
              <Play className="h-4 w-4 translate-x-0.5" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{course.title}</p>
              <div className="mt-1 flex items-center gap-1 text-white/40">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{course.duration} left</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

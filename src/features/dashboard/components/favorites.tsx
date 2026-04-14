"use client"

import { Heart, Clock, User } from "lucide-react"

interface FavoriteCourse {
  id: string
  title: string
  instructor: string
  duration: string
  isFavorite?: boolean
}

interface FavoritesProps {
  title?: string
  favorites: FavoriteCourse[]
  onCourseClick?: (courseId: string) => void
}

export default function Favorites({ title = "Your Favorites", favorites, onCourseClick }: FavoritesProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-white">{title}</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((course) => (
          <div
            key={course.id}
            className="group relative cursor-pointer rounded-xl border border-white/6 bg-[#1e1e2e] p-4 transition hover:border-white/10 hover:bg-[#22223a]"
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
            {/* Favorite icon */}
            <button className="absolute right-3 top-3 text-rose-400 transition hover:scale-110">
              <Heart className="h-4 w-4 fill-rose-400" />
            </button>

            <p className="mb-3 pr-6 text-sm font-semibold leading-snug text-white group-hover:text-blue-300 transition-colors">
              {course.title}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-white/40">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="text-xs">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{course.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

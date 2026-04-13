"use client"

import { motion } from "framer-motion"
import { Star, Clock } from "lucide-react"
import type { RecommendedCourse } from "@/types/recommendations.types"

function RecommendationCard({
  item,
  index,
  onCourseClick,
}: {
  item: RecommendedCourse
  index: number
  onCourseClick?: (courseId: string, category?: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.07 }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="group relative w-36 flex-none cursor-pointer overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/8 sm:w-44 lg:w-52"
      onClick={() => onCourseClick?.(item.id, item.category)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onCourseClick?.(item.id, item.category)
        }
      }}
    >
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={item.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <div className="p-3">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-blue-400">
          {item.category || "General"}
        </span>
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white">{item.title}</h3>
        <div className="mt-2 flex items-center gap-2.5">
          <div className="flex items-center gap-1 font-medium text-[10px] text-green-400">
            ★ {item.relevance_score > 0 ? `${(item.relevance_score * 10).toFixed(0)}% Match` : "Trending"}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface RecommendationsProps {
  items: RecommendedCourse[]
  subtitle?: string
  onCourseClick?: (courseId: string, category?: string) => void
}

export default function Recommendations({ items, subtitle, onCourseClick }: RecommendationsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Recommended for you</h2>
          <p className="mt-0.5 text-xs text-white/40">{subtitle || "Based on your learning history"}</p>
        </div>
        <button className="text-xs font-medium text-blue-400 transition hover:text-blue-300">See all</button>
      </div>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 scrollbar-none">
        {items.map((item, i) => (
          <RecommendationCard key={item.id} item={item} index={i} onCourseClick={onCourseClick} />
        ))}
      </div>
    </section>
  )
}

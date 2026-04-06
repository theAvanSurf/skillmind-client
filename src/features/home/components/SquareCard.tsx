"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface SquareCardProps {
  id: string
  title: string
  category: string
  rating: number
  students: string
  image: string
  index?: number
  onClick?: (courseId: string) => void
}

export function SquareCard({ id, title, category, rating, students, image, index = 0, onClick }: SquareCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.07 }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="group relative w-36 flex-none cursor-pointer overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/8 sm:w-44 lg:w-52"
      onClick={() => onClick?.(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.(id)
        }
      }}
    >
      {/* Square image */}
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-blue-400">
          {category}
        </span>
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-semibold text-white/70">{rating}</span>
          <span className="text-[10px] text-white/35">· {students} students</span>
        </div>
      </div>
    </motion.div>
  )
}

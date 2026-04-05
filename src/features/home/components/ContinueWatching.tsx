"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { continueWatching } from "../mock-data"
import { useRouter } from "next/navigation"

type CWCourse = (typeof continueWatching)[number]

export function ProgressCard({ course }: { course: CWCourse }) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={() => router.push(`/courses/${course.id}`)}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative aspect-video w-52 flex-none cursor-pointer overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/8 sm:w-64 lg:w-72"
    >
      {/* Thumbnail */}
      <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Play button on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/40">
          <Play className="h-5 w-5 fill-white text-white" />
        </div>
      </motion.div>

      {/* Title — reveals on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 right-0 top-3 px-3"
      >
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow-lg">
          {course.title}
        </h3>
        <p className="mt-0.5 text-[11px] text-white/60">{course.currentLesson}</p>
      </motion.div>

      {/* Bottom info — always visible */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium text-white/50">{course.category}</span>
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <Clock className="h-3 w-3" />
            {course.duration}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 overflow-hidden rounded-full bg-white/15">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${course.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className={cn(
              "h-full rounded-full bg-linear-to-r",
              course.progress >= 70 ? "from-blue-400 to-sky-400" : "from-blue-500 to-blue-400"
            )}
          />
        </div>
        <p className="mt-1 text-[10px] text-white/40">{course.progress}% complete</p>
      </div>
    </motion.div>
  )
}

interface ContinueWatchingProps {
  courses: CWCourse[]
}

export default function ContinueWatching({ courses }: ContinueWatchingProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Pick up where you left off</h2>
        <button className="text-xs font-medium text-blue-400 transition hover:text-blue-300">See all</button>
      </div>

      {/* Horizontal scroll rail */}
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 scrollbar-none">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.07 }}
          >
            <ProgressCard course={course} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

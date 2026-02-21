"use client"

import { motion } from "framer-motion"
import { Star, Clock } from "lucide-react"
import type { personalRecommendations } from "../mock-data"

type Rec = (typeof personalRecommendations)[number]

function RecommendationCard({ item, index }: { item: Rec; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.07 }}
      whileHover={{ scale: 1.04, y: -4 }}
      className="group relative w-36 flex-none cursor-pointer overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/8 sm:w-44 lg:w-52"
    >
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <div className="p-3">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-blue-400">
          {item.category}
        </span>
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white">{item.title}</h3>
        <div className="mt-2 flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-semibold text-white/70">{item.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/35">
            <Clock className="h-3 w-3" />
            {item.duration}
          </div>
          <span className="text-[10px] text-white/35">{item.students} students</span>
        </div>
      </div>
    </motion.div>
  )
}

interface RecommendationsProps {
  items: Rec[]
}

export default function Recommendations({ items }: RecommendationsProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Recommended for you</h2>
          <p className="mt-0.5 text-xs text-white/40">Based on your learning history</p>
        </div>
        <button className="text-xs font-medium text-blue-400 transition hover:text-blue-300">See all</button>
      </div>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 scrollbar-none">
        {items.map((item, i) => (
          <RecommendationCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}

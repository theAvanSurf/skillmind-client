"use client"

import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"
import type { categories } from "../mock-data"

type Category = (typeof categories)[number]

interface CategoryCardsProps {
  categories: Category[]
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function CategoryCards({ categories }: CategoryCardsProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-white">Browse Categories</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            variants={itemVariants}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex h-32 sm:h-40 flex-col overflow-hidden rounded-2xl"
            style={{
              backgroundColor: "#181823",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Background image — hidden at rest, reveals on hover */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:opacity-100"
              style={{ backgroundImage: `url(${cat.image})` }}
            />

            {/* Dark scrim so text stays readable over the image */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Coloured accent gradient — sweeps up on hover */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-60 bg-linear-to-t",
                cat.color
              )}
            />

            {/* Shimmer glint on hover */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* REST state: icon + label centred */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 group-hover:opacity-0">
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-bold text-white/70">{cat.label}</span>
            </div>

            {/* HOVER state: content pinned to bottom-left */}
            <div className="relative z-10 mt-auto flex translate-y-2 flex-col gap-0.5 p-3 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-xl leading-none">{cat.icon}</span>
              <span className="mt-1 text-xs font-bold text-white drop-shadow-sm">{cat.label}</span>
              <span className="text-[10px] font-medium text-white/80">{cat.count} courses</span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}

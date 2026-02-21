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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl p-4 transition",
              `bg-linear-to-br ${cat.color}`
            )}
          >
            {/* Subtle shine */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 to-transparent" />
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-semibold text-white">{cat.label}</span>
            <span className="text-[10px] text-white/60">{cat.count} courses</span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
}

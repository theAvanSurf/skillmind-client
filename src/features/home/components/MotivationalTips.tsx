"use client"

import { motion, type Variants } from "framer-motion"
import type { motivationalTips } from "../mock-data"

type Tip = (typeof motivationalTips)[number]

interface MotivationalTipsProps {
  tips: Tip[]
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
}

export default function MotivationalTips({ tips }: MotivationalTipsProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-white">Your Progress Insights</h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        {tips.map((tip) => (
          <motion.div
            key={tip.id}
            variants={cardVariants}
            whileHover={{ y: -3 }}
            className="relative overflow-hidden rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 backdrop-blur-sm"
          >
            {/* Glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />

            <span className="mb-3 block text-3xl">{tip.emoji}</span>
            <h3 className="text-sm font-bold text-white">{tip.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-white/50">{tip.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

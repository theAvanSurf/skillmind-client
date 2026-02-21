"use client"

import { SquareCard } from "./SquareCard"
import type { becauseYouWatched } from "../mock-data"

type BYWData = typeof becauseYouWatched

interface BecauseYouWatchedProps {
  data: BYWData
}

export default function BecauseYouWatched({ data }: BecauseYouWatchedProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Because you watched{" "}
            <span className="text-blue-400">{data.sourceCourse}</span>
          </h2>
          <p className="mt-0.5 text-xs text-white/40">Courses learners like you loved next</p>
        </div>
        <button className="text-xs font-medium text-blue-400 transition hover:text-blue-300">See all</button>
      </div>

      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-3 scrollbar-none">
        {data.recommendations.map((course, i) => (
          <SquareCard key={course.id} {...course} index={i} />
        ))}
      </div>
    </section>
  )
}

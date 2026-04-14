"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { CourseEngagement } from "../types/professor.types"

interface Props {
  courses: CourseEngagement[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-[#12121a] px-3 py-2 text-xs shadow-lg">
      <p className="text-white/50 mb-1 max-w-32 truncate">{label}</p>
      <p className="font-semibold text-blue-400">{payload[0].value} students</p>
    </div>
  )
}

export default function EnrollmentChart({ courses }: Props) {
  const data = courses.map((c) => ({
    name: c.title.length > 16 ? c.title.slice(0, 16) + "…" : c.title,
    students: c.enrolledStudents,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="students" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#3b82f6" : "rgba(59,130,246,0.45)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

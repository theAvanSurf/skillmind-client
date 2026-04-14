import type { CourseStatus } from "../types/professor.types"

const styles: Record<CourseStatus, string> = {
  Active: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Verified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Inactive: "bg-white/5 text-white/30 border-white/10",
}

const labels: Record<CourseStatus, string> = {
  Active: "Draft",
  Verified: "Published",
  Inactive: "Inactive",
}

export default function CourseStatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

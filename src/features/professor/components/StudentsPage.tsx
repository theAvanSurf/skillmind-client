"use client"

import { useState } from "react"
import { Users, CheckCircle, Clock, Search, BookOpen, AlertTriangle } from "lucide-react"
import { useEnrolledStudents } from "../hooks/useProfessor"

export default function StudentsPage() {
  const { data: students, isLoading, error } = useEnrolledStudents()
  const [search, setSearch] = useState("")

  const filtered = students?.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.courseTitle.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-10 rounded-xl bg-white/5 w-64" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5" />)}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
        <AlertTriangle size={18} /> Failed to load students.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Students</h1>
          <p className="mt-1 text-sm text-white/40">{students?.length ?? 0} enrolled across all courses</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or course…"
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <Users size={36} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm font-semibold text-white/50">
            {search ? "No students match your search" : "No students yet"}
          </p>
          <p className="mt-1 text-xs text-white/25">Students will appear here once they enroll in your courses</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-white/30">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Paid</th>
                  <th className="px-5 py-3 font-medium">Enrolled</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.enrollmentId} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">
                          {s.studentName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white/80">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-white/50">
                        <BookOpen size={12} />
                        <span className="max-w-36 truncate">{s.courseTitle}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-emerald-400 font-medium">
                      {s.paidAmount === 0 ? "Free" : `$${s.paidAmount.toFixed(2)}`}
                    </td>
                    <td className="px-5 py-3 text-white/35 text-xs">
                      {new Date(s.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      {s.completedAt ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                          <CheckCircle size={12} /> Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-blue-400">
                          <Clock size={12} /> In progress
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

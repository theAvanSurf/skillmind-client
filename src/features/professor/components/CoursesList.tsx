"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, BookOpen, DollarSign, ArrowRight, AlertTriangle, Pencil } from "lucide-react"
import { useMyCourses, usePublishCourse } from "../hooks/useProfessor"
import CourseStatusBadge from "./CourseStatusBadge"
import CreateCourseModal from "./CreateCourseModal"
import { useRouter } from "next/navigation"

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(2)}`
}

export default function CoursesList() {
  const { data: courses, isLoading, error } = useMyCourses()
  const publishCourse = usePublishCourse()
  const [showCreate, setShowCreate] = useState(false)
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
        <AlertTriangle size={18} /> Failed to load courses.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="mt-1 text-sm text-white/40">{courses?.length ?? 0} courses</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <Plus size={16} /> New Course
        </button>
      </div>

      {!courses?.length ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <BookOpen size={36} className="mx-auto mb-4 text-white/20" />
          <p className="text-sm font-semibold text-white/50">No courses yet</p>
          <p className="mt-1 text-xs text-white/25">Create your first course to start teaching</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
          >
            <Plus size={14} /> Create course
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:border-white/12 transition"
            >
              <div className="flex items-start gap-4">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-16 w-24 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <BookOpen size={20} className="text-white/20" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CourseStatusBadge status={course.status} />
                  </div>
                  <h3 className="font-semibold text-white truncate">{course.title}</h3>
                  <p className="mt-0.5 text-xs text-white/40 line-clamp-1">{course.description}</p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-white/35">
                    <span className="flex items-center gap-1"><DollarSign size={12} /> {course.price === 0 ? "Free" : fmt(course.price)}</span>
                    {course.tags?.split(",").slice(0, 2).map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Link
                    href={`/professor/courses/${course.id}`}
                    className="flex items-center gap-1 rounded-xl bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={12} /> Manage
                  </Link>
                  {course.status === "Active" && (
                    <button
                      onClick={() => publishCourse.mutate(course.id)}
                      disabled={publishCourse.isPending}
                      className="flex items-center gap-1 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      Publish <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateCourseModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            setShowCreate(false)
            router.push(`/professor/courses/${id}`)
          }}
        />
      )}
    </div>
  )
}

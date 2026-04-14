"use client"

import { useState } from "react"
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Video,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Send,
} from "lucide-react"
import Link from "next/link"
import { useCourse, usePublishCourse, useCreateCourse } from "../hooks/useProfessor"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as svc from "../services/professor-services"
import { professorKeys } from "../hooks/useProfessor"
import CourseStatusBadge from "./CourseStatusBadge"
import type { Season, Lesson } from "../types/professor.types"

function fmtDuration(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

interface AddSeasonFormProps {
  courseId: string
  onDone: () => void
}

function AddSeasonForm({ courseId, onDone }: AddSeasonFormProps) {
  const [title, setTitle] = useState("")
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => svc.createSeason({ courseId, title, order: Date.now() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: professorKeys.course(courseId) })
      onDone()
    },
  })
  return (
    <div className="flex gap-2 mt-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Season title"
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
      />
      <button
        onClick={() => mutation.mutate()}
        disabled={!title.trim() || mutation.isPending}
        className="flex items-center gap-1 rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
      >
        {mutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Add
      </button>
      <button onClick={onDone} className="text-white/30 hover:text-white/60 px-2 transition text-sm">Cancel</button>
    </div>
  )
}

interface AddLessonFormProps {
  seasonId: string
  courseId: string
  onDone: () => void
}

function AddLessonForm({ seasonId, courseId, onDone }: AddLessonFormProps) {
  const [form, setForm] = useState({ title: "", videoUrl: "" })
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: () =>
      svc.createLesson({
        seasonId,
        title: form.title,
        videoUrl: form.videoUrl || undefined,
        order: Date.now(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: professorKeys.course(courseId) })
      onDone()
    },
  })
  return (
    <div className="space-y-2 mt-2 pl-4">
      <input
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Lesson title"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
      />
      <input
        value={form.videoUrl}
        onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
        placeholder="Video URL (YouTube or direct)"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
      />
      <div className="flex items-center justify-end gap-2">
        <button onClick={onDone} className="text-xs text-white/30 hover:text-white/60 transition">Cancel</button>
        <button
          onClick={() => mutation.mutate()}
          disabled={!form.title.trim() || mutation.isPending}
          className="flex items-center gap-1 rounded-xl bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Add lesson
        </button>
      </div>
    </div>
  )
}

interface SeasonCardProps {
  season: Season
  courseId: string
}

function SeasonCard({ season, courseId }: SeasonCardProps) {
  const [open, setOpen] = useState(true)
  const [addingLesson, setAddingLesson] = useState(false)

  return (
    <div className="rounded-xl border border-white/8 bg-white/2 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/2 transition"
      >
        {open ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
        <span className="flex-1 text-sm font-semibold text-white">{season.title}</span>
        <span className="text-xs text-white/30">{season.lessons.length} lessons</span>
      </button>

      {open && (
        <div className="border-t border-white/5 px-4 py-2">
          {season.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
          {addingLesson ? (
            <AddLessonForm seasonId={season.id} courseId={courseId} onDone={() => setAddingLesson(false)} />
          ) : (
            <button
              onClick={() => setAddingLesson(true)}
              className="mt-1 flex items-center gap-1.5 py-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
            >
              <Plus size={12} /> Add lesson
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <Video size={13} className="text-white/20 shrink-0" />
      <span className="flex-1 text-sm text-white/70 truncate">{lesson.title}</span>
      {lesson.durationSeconds > 0 && (
        <span className="text-xs text-white/25">{fmtDuration(lesson.durationSeconds)}</span>
      )}
    </div>
  )
}

export default function CourseEditor({ courseId }: { courseId: string }) {
  const { data: course, isLoading, error } = useCourse(courseId)
  const publishCourse = usePublishCourse()
  const [addingSeason, setAddingSeason] = useState(false)

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
  }

  if (error || !course) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
        <AlertTriangle size={18} /> Course not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/professor/courses" className="text-white/40 hover:text-white/70 transition">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white truncate">{course.title}</h1>
            <CourseStatusBadge status={course.status} />
          </div>
        </div>
        {course.status === "Active" && (
          <button
            onClick={() => publishCourse.mutate(courseId)}
            disabled={publishCourse.isPending}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {publishCourse.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Publish
          </button>
        )}
      </div>

      {/* Season / Lesson manager */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Content</p>
          {!addingSeason && (
            <button
              onClick={() => setAddingSeason(true)}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
            >
              <Plus size={13} /> Add season
            </button>
          )}
        </div>

        <div className="space-y-3">
          {course.seasons?.map((season) => (
            <SeasonCard key={season.id} season={season} courseId={courseId} />
          ))}
        </div>

        {addingSeason && (
          <AddSeasonForm courseId={courseId} onDone={() => setAddingSeason(false)} />
        )}

        {!course.seasons?.length && !addingSeason && (
          <div className="py-8 text-center text-sm text-white/25">
            No seasons yet. Add a season to start building your course content.
          </div>
        )}
      </div>

      {/* Exam link */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Exams</p>
            <p className="text-xs text-white/35 mt-0.5">Create assessments for this course</p>
          </div>
          <Link
            href={`/professor/exams?courseId=${courseId}`}
            className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Manage exams <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Certificates link */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Certificates</p>
            <p className="text-xs text-white/35 mt-0.5">Configure and issue completion certificates</p>
          </div>
          <Link
            href={`/professor/certificates?courseId=${courseId}`}
            className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Manage <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

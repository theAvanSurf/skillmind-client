"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Send,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react"
import {
  useExamsByCourse,
  useExam,
  useCreateExam,
  useAddQuestion,
  usePublishExam,
  useMyCourses,
} from "../hooks/useProfessor"
import type { QuestionType, ExamQuestion } from "../types/professor.types"

// ── Question type selector ─────────────────────────────────────────────────────

const Q_TYPES: { value: QuestionType; label: string }[] = [
  { value: "MultipleChoice", label: "Multiple Choice" },
  { value: "TrueFalse", label: "True / False" },
  { value: "OpenText", label: "Open Text" },
]

interface AddQuestionFormProps {
  examId: string
  onDone: () => void
}

function AddQuestionForm({ examId, onDone }: AddQuestionFormProps) {
  const [text, setText] = useState("")
  const [type, setType] = useState<QuestionType>("MultipleChoice")
  const [points, setPoints] = useState(1)
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ])
  const addQuestion = useAddQuestion()

  const setOption = (i: number, field: "text" | "isCorrect", value: string | boolean) => {
    setOptions((opts) => opts.map((o, idx) => (idx === i ? { ...o, [field]: value } : o)))
  }

  const markCorrect = (i: number) => {
    setOptions((opts) =>
      opts.map((o, idx) =>
        type === "MultipleChoice"
          ? { ...o, isCorrect: idx === i }
          : { ...o, isCorrect: idx === i ? !o.isCorrect : o.isCorrect }
      )
    )
  }

  const submit = async () => {
    const filteredOptions =
      type === "OpenText" ? [] : options.filter((o) => o.text.trim()).map((o) => ({ optionText: o.text, isCorrect: o.isCorrect }))
    await addQuestion.mutateAsync({
      examId,
      req: { questionText: text, questionType: type, points, order: Math.floor(Date.now() / 1000), options: filteredOptions },
    })
    onDone()
  }

  const trueFalseOptions = [
    { text: "True", isCorrect: options[0]?.isCorrect ?? false },
    { text: "False", isCorrect: options[1]?.isCorrect ?? false },
  ]

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Question text…"
            rows={2}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
          >
            {Q_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <input
            type="number"
            min={1}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
          />
        </div>
        <span className="flex items-center text-xs text-white/30">pts</span>
      </div>

      {type === "MultipleChoice" && (
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <button onClick={() => markCorrect(i)} className="shrink-0">
                {opt.isCorrect ? (
                  <CheckCircle size={16} className="text-emerald-400" />
                ) : (
                  <Circle size={16} className="text-white/20" />
                )}
              </button>
              <input
                value={opt.text}
                onChange={(e) => setOption(i, "text", e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/40"
              />
            </div>
          ))}
          <p className="text-[11px] text-white/25">Click the circle to mark the correct answer</p>
        </div>
      )}

      {type === "TrueFalse" && (
        <div className="flex gap-3">
          {trueFalseOptions.map((opt, i) => (
            <button
              key={opt.text}
              onClick={() => markCorrect(i)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-sm font-medium transition ${
                opt.isCorrect
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
              }`}
            >
              {opt.isCorrect ? <CheckCircle size={14} /> : <Circle size={14} />}
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {type === "OpenText" && (
        <p className="text-xs text-white/35">
          Open text answers must be graded manually in the Attempts tab.
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="text-xs text-white/30 hover:text-white/60 transition">Cancel</button>
        <button
          onClick={submit}
          disabled={!text.trim() || addQuestion.isPending}
          className="flex items-center gap-1 rounded-xl bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {addQuestion.isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Add question
        </button>
      </div>
    </div>
  )
}

// ── Question row ───────────────────────────────────────────────────────────────

function QuestionRow({ q, index }: { q: ExamQuestion; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-bold text-white/50">
          {index + 1}
        </span>
        <span className="flex-1 text-sm text-white/80 line-clamp-1">{q.questionText}</span>
        <span className="text-xs text-white/25">{q.questionType}</span>
        <span className="text-xs text-white/25">{q.points}pt</span>
        {open ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/30" />}
      </button>
      {open && (
        <div className="border-t border-white/5 px-4 py-3 space-y-1.5">
          {q.options.map((opt) => (
            <div key={opt.id} className={`flex items-center gap-2 text-sm ${opt.isCorrect ? "text-emerald-400" : "text-white/50"}`}>
              {opt.isCorrect ? <CheckCircle size={13} /> : <Circle size={13} className="text-white/20" />}
              {opt.optionText}
            </div>
          ))}
          {q.questionType === "OpenText" && (
            <p className="text-xs text-white/30 italic">Open text — graded manually</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Exam panel ─────────────────────────────────────────────────────────────────

function ExamPanel({ examId }: { examId: string }) {
  const { data: exam, isLoading } = useExam(examId)
  const publishExam = usePublishExam()
  const [addingQ, setAddingQ] = useState(false)

  if (isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
  if (!exam) return null

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{exam.title}</h3>
          <p className="text-xs text-white/35 mt-0.5">
            {exam.questionCount ?? exam.questions.length} questions · Passing: {exam.passingScore}pts
            {exam.durationMinutes ? ` · ${exam.durationMinutes} min` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {exam.status === "Published" ? (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">Published</span>
          ) : (
            <button
              onClick={() => publishExam.mutate(examId)}
              disabled={publishExam.isPending || (exam.questionCount ?? exam.questions.length) === 0}
              className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {publishExam.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {exam.questions.map((q, i) => (
          <QuestionRow key={q.id} q={q} index={i} />
        ))}
      </div>

      {addingQ ? (
        <AddQuestionForm examId={examId} onDone={() => setAddingQ(false)} />
      ) : (
        exam.status !== "Published" && (
          <button
            onClick={() => setAddingQ(true)}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
          >
            <Plus size={13} /> Add question
          </button>
        )
      )}
    </div>
  )
}

// ── Create exam form ───────────────────────────────────────────────────────────

function CreateExamForm({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const [form, setForm] = useState({ title: "", passingScore: 70, durationMinutes: "" })
  const createExam = useCreateExam()

  const submit = async () => {
    await createExam.mutateAsync({
      courseId,
      title: form.title,
      passingScore: form.passingScore,
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
    })
    onDone()
  }

  return (
    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
      <input
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Exam title (e.g. Midterm Quiz)"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
      />
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="number"
            value={form.passingScore}
            onChange={(e) => setForm((f) => ({ ...f, passingScore: Number(e.target.value) }))}
            placeholder="Passing score %"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            value={form.durationMinutes}
            onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
            placeholder="Duration (min, optional)"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="text-xs text-white/30 hover:text-white/60 transition">Cancel</button>
        <button
          onClick={submit}
          disabled={!form.title.trim() || createExam.isPending}
          className="flex items-center gap-1 rounded-xl bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {createExam.isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Create exam
        </button>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ExamBuilder() {
  const searchParams = useSearchParams()
  const preselectedCourseId = searchParams.get("courseId") ?? ""

  const { data: courses, isLoading: coursesLoading } = useMyCourses()
  const [selectedCourseId, setSelectedCourseId] = useState(preselectedCourseId)
  const { data: exams, isLoading: examsLoading } = useExamsByCourse(selectedCourseId)
  const [creatingExam, setCreatingExam] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Exams</h1>
        <p className="mt-1 text-sm text-white/40">Build and manage course assessments</p>
      </div>

      {/* Course selector */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/30">
          Select Course
        </label>
        {coursesLoading ? (
          <div className="h-10 animate-pulse rounded-xl bg-white/5" />
        ) : (
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
          >
            <option value="">— Choose a course —</option>
            {courses?.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {selectedCourseId && (
        <>
          {examsLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(2)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white/5" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {exams?.map((exam) => (
                <ExamPanel key={exam.id} examId={exam.id} />
              ))}

              {!exams?.length && !creatingExam && (
                <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                  <BookOpen size={32} className="mx-auto mb-3 text-white/20" />
                  <p className="text-sm text-white/40">No exams for this course yet</p>
                </div>
              )}

              {creatingExam ? (
                <CreateExamForm courseId={selectedCourseId} onDone={() => setCreatingExam(false)} />
              ) : (
                <button
                  onClick={() => setCreatingExam(true)}
                  className="flex items-center gap-2 rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/15"
                >
                  <Plus size={15} /> New exam
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

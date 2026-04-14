"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Clock, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { useExamAttempts, useGradeOpenText } from "../hooks/useProfessor"
import type { ExamAttempt } from "../types/professor.types"

function AttemptCard({ attempt }: { attempt: ExamAttempt }) {
  const [open, setOpen] = useState(false)
  const gradeOpenText = useGradeOpenText()
  const [gradeInputs, setGradeInputs] = useState<Record<string, { points: number; feedback: string }>>({})

  const openTextAnswers = attempt.answers.filter((a) => a.questionType === "OpenText" && a.isCorrect === null)
  const needsGrading = openTextAnswers.length > 0

  const setGradeInput = (qId: string, field: "points" | "feedback", value: string | number) => {
    setGradeInputs((g) => ({ ...g, [qId]: { ...g[qId], points: g[qId]?.points ?? 0, feedback: g[qId]?.feedback ?? "", [field]: value } }))
  }

  const submitGrade = async (questionId: string) => {
    const input = gradeInputs[questionId] ?? { points: 0, feedback: "" }
    await gradeOpenText.mutateAsync({
      attemptId: attempt.id,
      questionId,
      pointsAwarded: input.points,
      feedback: input.feedback || undefined,
    })
  }

  const passed = attempt.passed === true
  const failed = attempt.passed === false
  const pending = attempt.passed === null

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition"
      >
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          passed ? "bg-emerald-500/15 text-emerald-400" :
          failed ? "bg-red-500/15 text-red-400" :
          "bg-amber-500/15 text-amber-400"
        }`}>
          {passed ? <CheckCircle size={16} /> : failed ? <XCircle size={16} /> : <Clock size={16} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{attempt.studentName}</p>
          <p className="text-xs text-white/35">
            {attempt.completedAt
              ? new Date(attempt.completedAt).toLocaleDateString()
              : "In progress"}
          </p>
        </div>

        <div className="text-right">
          {attempt.score !== null ? (
            <p className={`text-sm font-bold ${passed ? "text-emerald-400" : "text-red-400"}`}>
              {attempt.score.toFixed(1)}%
            </p>
          ) : (
            <p className="text-xs text-amber-400">{needsGrading ? "Needs grading" : "Pending"}</p>
          )}
        </div>

        {open ? <ChevronUp size={14} className="text-white/30 shrink-0" /> : <ChevronDown size={14} className="text-white/30 shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-white/5 px-5 py-4 space-y-4">
          {attempt.answers.map((answer) => (
            <div key={answer.questionId} className="space-y-1.5">
              <p className="text-sm text-white/80 font-medium">{answer.questionText}</p>

              {answer.questionType === "OpenText" ? (
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                  <p className="text-sm text-white/60 italic">
                    {answer.openTextAnswer ?? <span className="text-white/25">No answer</span>}
                  </p>
                  {answer.isCorrect === null && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          placeholder="Points"
                          value={gradeInputs[answer.questionId]?.points ?? ""}
                          onChange={(e) => setGradeInput(answer.questionId, "points", Number(e.target.value))}
                          className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500/40"
                        />
                        <input
                          placeholder="Feedback (optional)"
                          value={gradeInputs[answer.questionId]?.feedback ?? ""}
                          onChange={(e) => setGradeInput(answer.questionId, "feedback", e.target.value)}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/40"
                        />
                        <button
                          onClick={() => submitGrade(answer.questionId)}
                          disabled={gradeOpenText.isPending}
                          className="flex items-center gap-1 rounded-xl bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                        >
                          {gradeOpenText.isPending ? <Loader2 size={11} className="animate-spin" /> : null}
                          Grade
                        </button>
                      </div>
                    </div>
                  )}
                  {answer.isCorrect !== null && (
                    <p className="mt-1 text-xs text-emerald-400">{answer.pointsAwarded} pts awarded</p>
                  )}
                </div>
              ) : (
                <div className={`flex items-center gap-2 text-sm ${
                  answer.isCorrect ? "text-emerald-400" : "text-red-400"
                }`}>
                  {answer.isCorrect ? <CheckCircle size={13} /> : <XCircle size={13} />}
                  <span>{answer.selectedOptionId ? "Answered" : "No answer"}</span>
                  <span className="text-white/30">· {answer.pointsAwarded} pts</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ExamGrader({ examId }: { examId: string }) {
  const { data: attempts, isLoading } = useExamAttempts(examId)

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5" />)}
      </div>
    )
  }

  if (!attempts?.length) {
    return (
      <div className="py-8 text-center text-sm text-white/25">No submissions yet</div>
    )
  }

  const stats = {
    total: attempts.length,
    passed: attempts.filter((a) => a.passed).length,
    needsGrading: attempts.filter((a) => a.answers.some((x) => x.questionType === "OpenText" && x.isCorrect === null)).length,
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
          <p className="text-xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-white/35">Submissions</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
          <p className="text-xl font-bold text-emerald-400">{stats.passed}</p>
          <p className="text-xs text-white/35">Passed</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
          <p className="text-xl font-bold text-amber-400">{stats.needsGrading}</p>
          <p className="text-xs text-white/35">Need review</p>
        </div>
      </div>

      <div className="space-y-2">
        {attempts.map((attempt) => (
          <AttemptCard key={attempt.id} attempt={attempt} />
        ))}
      </div>
    </div>
  )
}

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Clock, Trophy, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

interface ExamQuestion {
  id: string;
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  options: QuestionOption[];
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  passingScore: number;
  isAutoGraded: boolean;
  questionCount: number;
  questions: ExamQuestion[];
}

interface AttemptAnswer {
  questionId: string;
  questionText: string;
  selectedOptionId?: string;
  selectedOptionText?: string;
  textAnswer?: string;
  isCorrect?: boolean;
  pointsAwarded?: number;
}

interface ExamResult {
  id: string;
  examId: string;
  score?: number;
  passed?: boolean;
  isGraded: boolean;
  professorFeedback?: string;
  submittedAt?: string;
  answers: AttemptAnswer[];
}

type PageState = "loading" | "taking" | "submitting" | "result" | "error";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ExamPage() {
  const { id: courseId, examId } = useParams<{ id: string; examId: string }>();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [exam, setExam] = useState<Exam | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId?: string; textAnswer?: string }>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const submitExam = useCallback(async (currentAnswers: typeof answers) => {
    if (!exam) return;
    setPageState("submitting");
    stopTimer();

    const payload = {
      answers: exam.questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: currentAnswers[q.id]?.selectedOptionId ?? null,
        textAnswer: currentAnswers[q.id]?.textAnswer ?? null,
      })),
    };

    try {
      const res = await fetch(`/api/courses/${courseId}/exams/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Submit failed");
      setResult(data);
      setPageState("result");
    } catch {
      setPageState("taking");
    }
  }, [exam, courseId, examId, stopTimer]);

  useEffect(() => {
    const load = async () => {
      try {
        // Check existing result first
        const resultRes = await fetch(`/api/courses/${courseId}/exams/${examId}/my-result`);
        if (resultRes.ok) {
          const resultData = await resultRes.json();
          if (resultData && resultData.id) {
            setResult(resultData);
            setPageState("result");
            return;
          }
        }

        // Load exam
        const examRes = await fetch(`/api/courses/${courseId}/exams/${examId}`);
        if (!examRes.ok) throw new Error("Exam not found");
        const examData = await examRes.json();
        setExam(examData);
        setTimeLeft(examData.durationMinutes * 60);
        setPageState("taking");
      } catch {
        setPageState("error");
      }
    };
    load();
  }, [courseId, examId]);

  useEffect(() => {
    if (pageState !== "taking" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto-submit when time runs out
          setAnswers((currentAnswers) => {
            submitExam(currentAnswers);
            return currentAnswers;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState]);

  const setOptionAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { selectedOptionId: optionId } }));
  };

  const setTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { textAnswer: text } }));
  };

  if (pageState === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-blue-400 animate-spin" />
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-white font-semibold">Exam not available</p>
        <button onClick={() => router.back()} className="text-sm text-blue-400 hover:underline">Go back</button>
      </div>
    );
  }

  if (pageState === "result" && result) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <button onClick={() => router.push(`/my-courses/${courseId}?tab=exams`)} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition">
          <ChevronLeft size={16} /> Back to course
        </button>

        <div className={`rounded-2xl border p-8 text-center ${result.passed ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}>
          {result.passed ? (
            <CheckCircle size={48} className="mx-auto mb-3 text-green-400" />
          ) : (
            <XCircle size={48} className="mx-auto mb-3 text-red-400" />
          )}
          <h1 className="text-2xl font-bold text-white">{result.passed ? "Passed!" : "Not Passed"}</h1>
          {result.isGraded && result.score !== undefined ? (
            <p className="mt-2 text-4xl font-black text-white">{result.score} <span className="text-lg font-normal text-white/50">points</span></p>
          ) : (
            <p className="mt-2 text-sm text-white/50">Awaiting manual grading</p>
          )}
          {result.professorFeedback && (
            <div className="mt-4 rounded-xl bg-white/5 p-4 text-left">
              <p className="text-xs font-semibold text-white/40 uppercase mb-1">Professor Feedback</p>
              <p className="text-sm text-white/80">{result.professorFeedback}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Answers</h2>
          {result.answers.map((ans, i) => (
            <div key={ans.questionId} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">{i + 1}. {ans.questionText}</p>
              <div className="mt-2 flex items-center gap-2">
                {ans.isCorrect === true && <CheckCircle size={14} className="text-green-400 shrink-0" />}
                {ans.isCorrect === false && <XCircle size={14} className="text-red-400 shrink-0" />}
                {ans.isCorrect === null || ans.isCorrect === undefined ? <AlertCircle size={14} className="text-yellow-400 shrink-0" /> : null}
                <p className="text-sm text-white/70">{ans.selectedOptionText ?? ans.textAnswer ?? <span className="text-white/30 italic">No answer</span>}</p>
                {ans.pointsAwarded !== undefined && ans.pointsAwarded !== null && (
                  <span className="ml-auto text-xs font-semibold text-white/40">+{ans.pointsAwarded}pts</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const answeredCount = Object.keys(answers).length;
  const timerWarning = timeLeft <= 60;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{exam.title}</h1>
          {exam.description && <p className="text-sm text-white/50 mt-0.5">{exam.description}</p>}
        </div>
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono font-bold text-lg border ${
          timerWarning ? "border-red-500/40 bg-red-500/10 text-red-400 animate-pulse" : "border-white/10 bg-white/5 text-white"
        }`}>
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-white/40 shrink-0">{answeredCount}/{exam.questions.length} answered</span>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {exam.questions.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white leading-relaxed">
                <span className="text-white/40 mr-2">{qi + 1}.</span>{q.questionText}
              </p>
              <span className="shrink-0 text-xs text-white/30">{q.points}pt{q.points !== 1 ? "s" : ""}</span>
            </div>

            {q.questionType === "OpenText" ? (
              <textarea
                value={answers[q.id]?.textAnswer ?? ""}
                onChange={(e) => setTextAnswer(q.id, e.target.value)}
                placeholder="Write your answer here..."
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-blue-500/50"
              />
            ) : (
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id]?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setOptionAnswer(q.id, opt.id)}
                      className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition ${
                        selected
                          ? "border-blue-500 bg-blue-500/15 text-white font-semibold"
                          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {opt.optionText}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center justify-between gap-4">
        <div className="text-sm text-white/50">
          {answeredCount < exam.questions.length
            ? `${exam.questions.length - answeredCount} question${exam.questions.length - answeredCount !== 1 ? "s" : ""} unanswered`
            : <span className="text-green-400 font-semibold">All questions answered</span>}
        </div>
        <button
          onClick={() => submitExam(answers)}
          disabled={pageState === "submitting"}
          className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {pageState === "submitting" ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Trophy size={14} />
              Submit Exam
            </>
          )}
        </button>
      </div>
    </div>
  );
}

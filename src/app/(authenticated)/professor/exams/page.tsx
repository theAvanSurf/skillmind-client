"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle, XCircle, Clock, Sparkles } from "lucide-react";
import { fetchExamOverviews, fetchExamSubmissions } from "@/features/professor/services/professor-dashboard.service";
import type { ExamOverview, ExamSubmission } from "@/types/professor.types";
import {
  ChartMetricStrip,
  DonutChartCard,
  TrendAreaChartCard,
  compactNumber,
} from "@/features/professor/components/charts/ProfessorCharts";

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const loadExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchExamOverviews();
      setExams(data);
      if (data.length > 0 && !selectedExamId) {
        setSelectedExamId(data[0].examId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exams");
    } finally {
      setIsLoading(false);
    }
  }, [selectedExamId]);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  // Load submissions when selected exam changes
  useEffect(() => {
    if (!selectedExamId) return;

    const loadSubmissions = async () => {
      setLoadingSubmissions(true);
      try {
        const data = await fetchExamSubmissions(selectedExamId);
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load submissions");
      } finally {
        setLoadingSubmissions(false);
      }
    };

    void loadSubmissions();
  }, [selectedExamId]);

  const selectedExam = useMemo(() => exams.find((e) => e.examId === selectedExamId), [exams, selectedExamId]);

  const submissionScoreData = useMemo(() => {
    return submissions
      .slice()
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      .map((submission, index) => ({
        label: submission.studentName.split(" ")[0] ?? `S${index + 1}`,
        score: submission.percentage ?? 0,
      }));
  }, [submissions]);

  const statusBreakdown = useMemo(
    () => [
      { name: "Graded", value: submissions.filter((submission) => submission.status === "graded").length },
      { name: "Pending", value: submissions.filter((submission) => submission.status === "pending_review").length },
      { name: "Submitted", value: submissions.filter((submission) => submission.status === "submitted").length },
    ].filter((item) => item.value > 0),
    [submissions]
  );

  const summaryChips = useMemo(
    () =>
      selectedExam
        ? [
            { label: "Attempts", value: compactNumber(selectedExam.totalAttempts), tone: "bg-blue-500/10" },
            { label: "Pass rate", value: `${selectedExam.passRate}%`, tone: "bg-emerald-500/10" },
            { label: "Median", value: `${selectedExam.medianScore.toFixed(0)}`, tone: "bg-violet-500/10" },
            { label: "Average", value: `${selectedExam.averageScore.toFixed(1)}`, tone: "bg-amber-500/10" },
          ]
        : [],
    [selectedExam]
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-5 sm:p-8">
        <div className="h-8 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-white/8" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-white">
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6">
          <div className="flex items-center gap-3 text-red-300">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Unable to load exams</h2>
          </div>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
          <button
            onClick={() => void loadExams()}
            className="mt-4 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-5 text-white sm:p-8">
      {selectedExam && (
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.15),transparent_25%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_24%),linear-gradient(180deg,rgba(8,12,24,0.96),rgba(5,8,16,0.92))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.38)] sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0,transparent_22%,transparent_78%,rgba(255,255,255,0.04)_100%)] opacity-60" />
          <div className="relative grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                <Sparkles className="h-3.5 w-3.5" />
                Exams workspace
              </div>

              <div>
                <h1 className="max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Assessment review and grading flow
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                  Keep exam quality high with score trends, status mix, and review backlog visibility.
                </p>
              </div>

              <ChartMetricStrip items={summaryChips} />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Passed</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{compactNumber(selectedExam.passCount)}</p>
                  <p className="mt-1 text-sm text-emerald-300">Students cleared</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Failed</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{compactNumber(selectedExam.failCount)}</p>
                  <p className="mt-1 text-sm text-rose-300">Needs review</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Submissions</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{compactNumber(submissions.length)}</p>
                  <p className="mt-1 text-sm text-blue-300">Loaded in view</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-5">
              <div className="xl:col-span-3">
                <TrendAreaChartCard
                  title="Submission score trail"
                  description="See how student submissions are landing across the selected exam."
                  data={submissionScoreData}
                  xKey="label"
                  yKey="score"
                  stroke="#60a5fa"
                  gradientFrom="rgba(96, 165, 250, 0.8)"
                  gradientTo="rgba(96, 165, 250, 0.02)"
                  yFormatter={(value) => `${value}%`}
                  footer={<p className="text-xs text-white/50">The scoring curve makes it easier to spot outliers fast.</p>}
                />
              </div>
              <div className="xl:col-span-2">
                <DonutChartCard
                  title="Submission status mix"
                  description="How the review queue is currently balanced."
                  data={statusBreakdown}
                  nameKey="name"
                  valueKey="value"
                  colors={["#22c55e", "#f59e0b", "#60a5fa"]}
                  footer={<p className="text-xs text-white/50">Useful for seeing review pressure at a glance.</p>}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <div>
        <h2 className="text-xl font-semibold">Exams & Assessments</h2>
        <p className="mt-1 text-sm text-white/70">Review exam submissions, auto-grading results, and student performance.</p>
      </div>

      {/* Exam Selection */}
      {exams.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-white/90">Select Exam</label>
          <select
            value={selectedExamId || ""}
            onChange={(e) => {
              setSelectedExamId(e.target.value || null);
              setSubmissions([]);
            }}
            className="mt-2 max-w-md rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Choose an exam...</option>
            {exams.map((exam) => (
              <option key={exam.examId} value={exam.examId}>
                {exam.examName} - {exam.courseName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedExam && (
        <>
          {/* Exam Overview Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <ExamStatCard
              label="Total Attempts"
              value={selectedExam.totalAttempts.toString()}
              icon={BarChart3}
              color="from-blue-500/20 to-blue-600/20"
            />
            <ExamStatCard
              label="Pass Rate"
              value={`${selectedExam.passRate}%`}
              icon={CheckCircle}
              color="from-green-500/20 to-green-600/20"
            />
            <ExamStatCard
              label="Passed"
              value={selectedExam.passCount.toString()}
              icon={CheckCircle}
              color="from-green-500/20 to-green-600/20"
            />
            <ExamStatCard
              label="Failed"
              value={selectedExam.failCount.toString()}
              icon={XCircle}
              color="from-red-500/20 to-red-600/20"
            />
            <ExamStatCard
              label="Avg Score"
              value={`${selectedExam.averageScore.toFixed(1)}`}
              icon={Clock}
              color="from-purple-500/20 to-purple-600/20"
            />
          </div>

          {/* Distribution Chart (Text-based) */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 font-semibold text-white">Score Distribution</h2>
            <div className="space-y-3">
              <ScoreDistributionBar label="90-100 (A)" percentage={35} color="from-green-400 to-green-500" />
              <ScoreDistributionBar label="80-89 (B)" percentage={28} color="from-blue-400 to-blue-500" />
              <ScoreDistributionBar label="70-79 (C)" percentage={20} color="from-yellow-400 to-yellow-500" />
              <ScoreDistributionBar label="60-69 (D)" percentage={12} color="from-orange-400 to-orange-500" />
              <ScoreDistributionBar label="Below 60 (F)" percentage={5} color="from-red-400 to-red-500" />
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Student Submissions</h2>
            {loadingSubmissions ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-white/10" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/4 p-8 text-center">
                <p className="text-white/70">No submissions for this exam yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{submission.studentName}</p>
                      <p className="mt-0.5 text-xs text-white/50">
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {submission.status === "graded" && submission.percentage !== undefined && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {submission.percentage}%
                        </div>
                        <div className="mt-0.5 text-xs text-white/50">
                          {submission.score}/{submission.maxScore}
                        </div>
                      </div>
                    )}

                    <div className="ml-4 flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          submission.status === "graded"
                            ? "bg-green-500/20 text-green-300"
                            : submission.status === "submitted"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {submission.status}
                      </span>
                      <button className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/30">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface ExamStatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function ExamStatCard({ label, value, icon: Icon, color }: ExamStatCardProps) {
  return (
    <div className={`rounded-xl border border-white/10 bg-linear-to-br ${color} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-white/70">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-2">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}

interface ScoreDistributionBarProps {
  label: string;
  percentage: number;
  color: string;
}

function ScoreDistributionBar({ label, percentage, color }: ScoreDistributionBarProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-semibold text-white">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full bg-linear-to-r ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

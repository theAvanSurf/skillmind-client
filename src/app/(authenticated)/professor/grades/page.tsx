"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Filter, Download, Send, ChevronDown, Sparkles } from "lucide-react";
import { fetchStudentGrades, publishGrade } from "@/features/professor/services/professor-dashboard.service";
import type { StudentGrade, GradeFilter, GradeStatus } from "@/types/professor.types";
import {
  ChartMetricStrip,
  DonutChartCard,
  TrendAreaChartCard,
  DistributionBarChartCard,
  compactNumber,
} from "@/features/professor/components/charts/ProfessorCharts";

export default function GradesManagementPage() {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<GradeStatus[]>(["pending", "completed"]);
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [studentSearch, setStudentSearch] = useState<string>("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const loadGrades = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filter: GradeFilter = {
        status: statusFilter,
        courseId: courseFilter || undefined,
        studentId: studentSearch ? studentSearch : undefined,
      };

      const data = await fetchStudentGrades(filter);
      setGrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load grades");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, courseFilter, studentSearch]);

  useEffect(() => {
    void loadGrades();
  }, [loadGrades]);

  const courses = useMemo(() => {
    const courseSet = new Set(grades.map((g) => g.courseName));
    return Array.from(courseSet);
  }, [grades]);

  const filteredGrades = useMemo(() => {
    return grades.filter((grade) => {
      const matchesCourse = !courseFilter || grade.courseName === courseFilter;
      const matchesSearch =
        !studentSearch || grade.studentName.toLowerCase().includes(studentSearch.toLowerCase());
      return matchesCourse && matchesSearch;
    });
  }, [grades, courseFilter, studentSearch]);

  const gradeMetrics = useMemo(() => {
    const total = filteredGrades.length;
    const pending = filteredGrades.filter((grade) => grade.status === "pending").length;
    const grading = filteredGrades.filter((grade) => grade.status === "grading").length;
    const completed = filteredGrades.filter((grade) => grade.status === "completed").length;
    const averageScore = total > 0 ? Math.round(filteredGrades.reduce((sum, grade) => sum + grade.percentage, 0) / total) : 0;

    return { total, pending, grading, completed, averageScore };
  }, [filteredGrades]);

  const scoreTrendData = useMemo(() => {
    return [...filteredGrades]
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      .slice(-8)
      .map((grade) => ({
        label: new Date(grade.submittedAt).toLocaleDateString([], { month: "short", day: "numeric" }),
        score: grade.percentage,
      }));
  }, [filteredGrades]);

  const courseAverageData = useMemo(() => {
    const grouped = filteredGrades.reduce<Record<string, { total: number; count: number }>>((acc, grade) => {
      if (!acc[grade.courseName]) {
        acc[grade.courseName] = { total: 0, count: 0 };
      }
      acc[grade.courseName].total += grade.percentage;
      acc[grade.courseName].count += 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([course, data]) => ({
      course,
      average: Math.round(data.total / data.count),
    }));
  }, [filteredGrades]);

  const statusBreakdown = useMemo(
    () => [
      { name: "Completed", value: gradeMetrics.completed },
      { name: "Pending", value: gradeMetrics.pending },
      { name: "Grading", value: gradeMetrics.grading },
    ].filter((item) => item.value > 0),
    [gradeMetrics]
  );

  const summaryChips = useMemo(
    () => [
      { label: "Total graded", value: compactNumber(gradeMetrics.total), tone: "bg-blue-500/10" },
      { label: "Average score", value: `${gradeMetrics.averageScore}%`, tone: "bg-emerald-500/10" },
      { label: "Pending review", value: compactNumber(gradeMetrics.pending), tone: "bg-amber-500/10" },
      { label: "Published", value: compactNumber(gradeMetrics.completed), tone: "bg-violet-500/10" },
    ],
    [gradeMetrics]
  );

  const handlePublishGrade = useCallback(
    async (gradeId: string) => {
      try {
        const updated = await publishGrade(gradeId);
        if (updated) {
          setGrades((prev) =>
            prev.map((g) => (g.id === gradeId ? { ...g, status: "completed", publishedAt: new Date().toISOString() } : g))
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to publish grade");
      }
    },
    []
  );

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-white">
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6">
          <div className="flex items-center gap-3 text-red-300">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Unable to load grades</h2>
          </div>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
          <button
            onClick={() => void loadGrades()}
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
      <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_24%),linear-gradient(180deg,rgba(8,12,24,0.96),rgba(5,8,16,0.92))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.38)] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0,transparent_22%,transparent_78%,rgba(255,255,255,0.04)_100%)] opacity-60" />
        <div className="relative grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
              <Sparkles className="h-3.5 w-3.5" />
              Grades workspace
            </div>

            <div>
              <h1 className="max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">
                Review queue and grade publishing
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                Track what is pending, publish instantly, and keep grade quality high.
              </p>
            </div>

            <ChartMetricStrip items={summaryChips} />

            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
                <Download className="h-4 w-4" />
                Export Grades
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
                <Send className="h-4 w-4" />
                Notify Students
              </button>
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-blue-500/20 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/30"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Ready to publish</p>
                <p className="mt-2 text-2xl font-semibold text-white">{compactNumber(gradeMetrics.pending)}</p>
                <p className="mt-1 text-sm text-amber-300">Waiting for review</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Average score</p>
                <p className="mt-2 text-2xl font-semibold text-white">{gradeMetrics.averageScore}%</p>
                <p className="mt-1 text-sm text-emerald-300">Across current filters</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Published</p>
                <p className="mt-2 text-2xl font-semibold text-white">{compactNumber(gradeMetrics.completed)}</p>
                <p className="mt-1 text-sm text-blue-300">Visible to students</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <TrendAreaChartCard
                title="Score momentum"
                description="Latest submissions and how the class is trending."
                data={scoreTrendData}
                xKey="label"
                yKey="score"
                stroke="#38bdf8"
                gradientFrom="rgba(56, 189, 248, 0.8)"
                gradientTo="rgba(56, 189, 248, 0.02)"
                yFormatter={(value) => `${value}%`}
                footer={<p className="text-xs text-white/50">Published grades sit at the top of the flow.</p>}
              />
            </div>
            <div className="xl:col-span-2">
              <DonutChartCard
                title="Review status"
                description="See what is already published and what still needs attention."
                data={statusBreakdown}
                nameKey="name"
                valueKey="value"
                colors={["#22c55e", "#f59e0b", "#60a5fa"]}
                footer={<p className="text-xs text-white/50">This ring helps spot where the queue is building up.</p>}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-white/90">Course</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90">Status</label>
              <div className="mt-2 space-y-2">
                {["pending", "completed", "grading"].map((status) => (
                  <label key={status} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status as GradeStatus)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStatusFilter([...statusFilter, status as GradeStatus]);
                        } else {
                          setStatusFilter(statusFilter.filter((s) => s !== status));
                        }
                      }}
                      className="h-4 w-4 cursor-pointer rounded border-white/25 bg-black/40"
                    />
                    <span className="ml-2 text-sm text-white/80 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90">Search Student</label>
              <input
                type="text"
                placeholder="Student name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Grades Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-white/10" />
          ))}
        </div>
      ) : filteredGrades.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/4 p-8 text-center">
          <p className="text-white/70">No grades found matching your filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 border-b border-white/10 bg-[#0b1020] backdrop-blur-xl">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-white">Student</th>
                  <th className="px-4 py-4 text-left font-semibold text-white">Course</th>
                  <th className="px-4 py-4 text-left font-semibold text-white">Exam</th>
                  <th className="px-4 py-4 text-center font-semibold text-white">Score</th>
                  <th className="px-4 py-4 text-center font-semibold text-white">%</th>
                  <th className="px-4 py-4 text-left font-semibold text-white">Status</th>
                  <th className="px-4 py-4 text-center font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="transition hover:bg-white/6">
                    <td className="px-4 py-4 text-white">{grade.studentName}</td>
                    <td className="px-4 py-4 text-white/80">{grade.courseName}</td>
                    <td className="px-4 py-4 text-white/80">{grade.examName}</td>
                    <td className="px-4 py-4 text-center font-semibold text-white">
                      {grade.score}/{grade.maxScore}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold text-white">{grade.percentage}%</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          grade.status === "completed"
                            ? "border-emerald-500/25 bg-emerald-500/15 text-emerald-300"
                            : grade.status === "pending"
                              ? "border-amber-500/25 bg-amber-500/15 text-amber-300"
                              : "border-sky-500/25 bg-sky-500/15 text-sky-300"
                        }`}
                      >
                        {grade.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {grade.status === "pending" && (
                          <button
                            onClick={() => handlePublishGrade(grade.id)}
                            className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-cyan-400"
                          >
                            Publish
                          </button>
                        )}
                        <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination info */}
      <div className="text-xs text-white/50">
        Showing {filteredGrades.length} of {grades.length} grades
      </div>
    </div>
  );
}

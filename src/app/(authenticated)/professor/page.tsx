"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, TrendingUp, Users, DollarSign, Award, AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import {
  fetchDashboardSummary,
  fetchAlerts,
  fetchStudentGrades,
  fetchEngagementMetrics,
  fetchExamOverviews,
  fetchEarningsBreakdown,
  publishGrade,
} from "@/features/professor/services/professor-dashboard.service";
import type {
  DashboardSummary,
  DashboardAlert,
  StudentGrade,
  EngagementMetrics,
  ExamOverview,
  EarningsBreakdown,
} from "@/types/professor.types";
import DashboardSummaryPanel from "@/features/professor/components/dashboard/DashboardSummaryPanel";
import AlertsPanel from "@/features/professor/components/dashboard/AlertsPanel";
import QuickActionButtons from "@/features/professor/components/dashboard/QuickActionButtons";
import {
  ChartMetricStrip,
  DonutChartCard,
  DistributionBarChartCard,
  TrendAreaChartCard,
  compactNumber,
} from "@/features/professor/components/charts/ProfessorCharts";

export default function ProfessorDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [metrics, setMetrics] = useState<EngagementMetrics[]>([]);
  const [examOverviews, setExamOverviews] = useState<ExamOverview[]>([]);
  const [earningsBreakdown, setEarningsBreakdown] = useState<EarningsBreakdown | null>(null);
  const [publishingIds, setPublishingIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryData, alertsData, gradesData, metricsData, examData, earningsData] = await Promise.all([
        fetchDashboardSummary(),
        fetchAlerts(),
        fetchStudentGrades(),
        fetchEngagementMetrics(),
        fetchExamOverviews(),
        fetchEarningsBreakdown(),
      ]);

      setSummary(summaryData);
      setAlerts(alertsData);
      setGrades(gradesData);
      setMetrics(metricsData);
      setExamOverviews(examData);
      setEarningsBreakdown(earningsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const heroTrendData = useMemo(() => {
    const activeStudents = summary?.activeStudents ?? 0;
    const totalEarnings = summary?.totalEarnings ?? 0;

    return [
      { day: "Mon", engagement: Math.round(activeStudents * 0.72), revenue: Math.round(totalEarnings * 0.06) },
      { day: "Tue", engagement: Math.round(activeStudents * 0.79), revenue: Math.round(totalEarnings * 0.08) },
      { day: "Wed", engagement: Math.round(activeStudents * 0.85), revenue: Math.round(totalEarnings * 0.1) },
      { day: "Thu", engagement: Math.round(activeStudents * 0.9), revenue: Math.round(totalEarnings * 0.11) },
      { day: "Fri", engagement: Math.round(activeStudents * 0.96), revenue: Math.round(totalEarnings * 0.13) },
      { day: "Sat", engagement: Math.round(activeStudents * 0.88), revenue: Math.round(totalEarnings * 0.1) },
      { day: "Sun", engagement: Math.round(activeStudents * 0.82), revenue: Math.round(totalEarnings * 0.09) },
    ];
  }, [summary]);

  const alertSeverityData = useMemo(() => {
    const counts = alerts.reduce(
      (acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] ?? 0) + 1;
        return acc;
      },
      { critical: 0, warning: 0, info: 0 } as Record<string, number>
    );

    return [
      { name: "Critical", value: counts.critical },
      { name: "Warning", value: counts.warning },
      { name: "Info", value: counts.info },
    ].filter((item) => item.value > 0);
  }, [alerts]);

  const pendingGrades = useMemo(
    () => grades.filter((grade) => grade.status === "pending" || grade.status === "grading"),
    [grades]
  );

  const courseControlRows = useMemo(() => {
    const gradesByCourse = grades.reduce<Record<string, { total: number; count: number; pending: number }>>((acc, grade) => {
      if (!acc[grade.courseId]) {
        acc[grade.courseId] = { total: 0, count: 0, pending: 0 };
      }

      acc[grade.courseId].total += grade.percentage;
      acc[grade.courseId].count += 1;

      if (grade.status !== "completed") {
        acc[grade.courseId].pending += 1;
      }

      return acc;
    }, {});

    const examsByCourse = examOverviews.reduce<Record<string, { passRateTotal: number; count: number }>>((acc, exam) => {
      if (!acc[exam.courseId]) {
        acc[exam.courseId] = { passRateTotal: 0, count: 0 };
      }
      acc[exam.courseId].passRateTotal += exam.passRate;
      acc[exam.courseId].count += 1;
      return acc;
    }, {});

    return metrics.map((metric) => {
      const courseGrades = gradesByCourse[metric.courseId];
      const courseExams = examsByCourse[metric.courseId];

      const avgGrade = courseGrades?.count ? Math.round(courseGrades.total / courseGrades.count) : null;
      const examPassRate = courseExams?.count ? Math.round(courseExams.passRateTotal / courseExams.count) : null;
      const pendingCount = courseGrades?.pending ?? 0;
      const revenue = earningsBreakdown?.perCourse[metric.courseId] ?? 0;

      const healthScoreRaw =
        metric.completionRate * 0.4 +
        (avgGrade ?? 70) * 0.25 +
        (examPassRate ?? 70) * 0.25 +
        Math.max(0, 100 - pendingCount * 8) * 0.1;

      const healthScore = Math.max(0, Math.min(100, Math.round(healthScoreRaw)));

      return {
        courseId: metric.courseId,
        courseName: metric.courseName,
        completionRate: metric.completionRate,
        activeStudents: metric.activeStudentCount,
        totalStudents: metric.totalStudentCount,
        avgGrade,
        examPassRate,
        pendingCount,
        revenue,
        healthScore,
      };
    });
  }, [earningsBreakdown, examOverviews, grades, metrics]);

  const courseHealthChartData = useMemo(
    () =>
      courseControlRows.map((row) => ({
        course: row.courseName.length > 16 ? `${row.courseName.slice(0, 16)}…` : row.courseName,
        health: row.healthScore,
      })),
    [courseControlRows]
  );

  const activityFeed = useMemo(() => {
    const gradeEvents = grades
      .slice()
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 4)
      .map((grade) => ({
        id: `grade-${grade.id}`,
        type: "grade" as const,
        title: `${grade.studentName} submitted ${grade.examName}`,
        subtitle: `${grade.courseName} • ${grade.percentage}%`,
        timestamp: grade.submittedAt,
      }));

    const alertEvents = alerts.slice(0, 4).map((alert) => ({
      id: `alert-${alert.id}`,
      type: "alert" as const,
      title: alert.title,
      subtitle: alert.description,
      timestamp: alert.createdAt,
    }));

    return [...gradeEvents, ...alertEvents]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);
  }, [alerts, grades]);

  const handlePublishFromQueue = useCallback(async (gradeId: string) => {
    try {
      setPublishingIds((prev) => [...prev, gradeId]);
      const updated = await publishGrade(gradeId);

      if (updated) {
        setGrades((prev) =>
          prev.map((grade) =>
            grade.id === gradeId
              ? { ...grade, status: "completed", publishedAt: new Date().toISOString() }
              : grade
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish grade");
    } finally {
      setPublishingIds((prev) => prev.filter((id) => id !== gradeId));
    }
  }, []);

  const summaryChips = useMemo(
    () =>
      summary
        ? [
            {
              label: "Students",
              value: compactNumber(summary.totalStudentsEnrolled),
              tone: "bg-blue-500/10",
            },
            {
              label: "Active",
              value: compactNumber(summary.activeStudents),
              tone: "bg-emerald-500/10",
            },
            {
              label: "Completion",
              value: `${summary.courseCompletionRate}%`,
              tone: "bg-violet-500/10",
            },
            {
              label: "Payouts",
              value: `$${compactNumber(summary.pendingPayouts)}`,
              tone: "bg-amber-500/10",
            },
          ]
        : [],
    [summary]
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
        <div className="h-64 animate-pulse rounded-xl bg-white/8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-white">
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6">
          <div className="flex items-center gap-3 text-red-300">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Unable to load dashboard</h2>
          </div>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
          <button
            onClick={() => void loadDashboardData()}
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
      {summary && (
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_28%),linear-gradient(180deg,rgba(8,12,24,0.96),rgba(6,8,16,0.92))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.38)] sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_100%)] opacity-60" />
          <div className="relative space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500/40 to-cyan-500/30 text-sm font-bold text-white">
                  P
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Professor dashboard</p>
                  <h1 className="text-xl font-semibold tracking-tight text-white">Hello, Sabrina. Here is your control room.</h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                  Updated {new Date(summary.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <ChartMetricStrip items={summaryChips} />

            <div className="grid gap-4 xl:grid-cols-[1.05fr_1.35fr_1fr]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Publish queue</p>
                  <p className="mt-2 text-3xl font-bold text-white">{pendingGrades.length}</p>
                  <p className="mt-1 text-xs text-amber-300">Items waiting for release</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Students active now</p>
                  <p className="mt-2 text-3xl font-bold text-white">{compactNumber(summary.activeStudents)}</p>
                  <p className="mt-1 text-xs text-emerald-300">Across all your courses</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Net earnings</p>
                  <p className="mt-2 text-3xl font-bold text-white">${compactNumber(summary.totalEarnings)}</p>
                  <p className="mt-1 text-xs text-sky-300">Monitoring payout pipeline</p>
                </div>
              </div>

              <TrendAreaChartCard
                title="Learning activity"
                description="Course-wide student activity through the week."
                data={heroTrendData.map((point) => ({ ...point, total: point.engagement }))}
                xKey="day"
                yKey="total"
                stroke="#60a5fa"
                gradientFrom="rgba(96, 165, 250, 0.72)"
                gradientTo="rgba(96, 165, 250, 0.02)"
                yFormatter={(value) => compactNumber(value)}
                footer={<p className="text-xs text-white/50">Use this to spot dips before they become completion problems.</p>}
              />

              <div className="space-y-4">
                <DonutChartCard
                  title="Alert status"
                  description="What needs your attention first."
                  data={alertSeverityData}
                  nameKey="name"
                  valueKey="value"
                  colors={["#ef4444", "#f59e0b", "#38bdf8"]}
                  footer={<p className="text-xs text-white/50">Lower warning volume means smoother operations.</p>}
                />

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Quick actions</p>
                  <div className="mt-3">
                    <QuickActionButtons />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {alerts.length > 0 && <AlertsPanel alerts={alerts} onRetry={() => void loadDashboardData()} />}

      {summary && <DashboardSummaryPanel summary={summary} />}

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <DistributionBarChartCard
            title="Course health overview"
            description="A centralized score combining completion, grades, exams, and pending review pressure."
            data={courseHealthChartData}
            xKey="course"
            yKey="health"
            barColor="#22c55e"
            yFormatter={(value) => `${value}%`}
            footer={<p className="text-xs text-white/50">This is your at-a-glance risk map for every course you teach.</p>}
          />

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h3 className="text-lg font-semibold text-white">Course operations matrix</h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                {courseControlRows.length} courses tracked
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0b1020]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-white">Course</th>
                    <th className="px-4 py-3 text-center font-semibold text-white">Health</th>
                    <th className="px-4 py-3 text-center font-semibold text-white">Completion</th>
                    <th className="px-4 py-3 text-center font-semibold text-white">Avg Grade</th>
                    <th className="px-4 py-3 text-center font-semibold text-white">Exam Pass</th>
                    <th className="px-4 py-3 text-center font-semibold text-white">Pending</th>
                    <th className="px-4 py-3 text-right font-semibold text-white">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {courseControlRows.map((row) => (
                    <tr key={row.courseId} className="transition hover:bg-white/6">
                      <td className="px-4 py-3 text-white">
                        <p className="font-medium">{row.courseName}</p>
                        <p className="text-xs text-white/50">{compactNumber(row.activeStudents)}/{compactNumber(row.totalStudents)} active</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.healthScore >= 80
                            ? "bg-emerald-500/20 text-emerald-300"
                            : row.healthScore >= 65
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-red-500/20 text-red-300"
                        }`}>
                          {row.healthScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-white/85">{row.completionRate}%</td>
                      <td className="px-4 py-3 text-center text-white/85">{row.avgGrade !== null ? `${row.avgGrade}%` : "—"}</td>
                      <td className="px-4 py-3 text-center text-white/85">{row.examPassRate !== null ? `${row.examPassRate}%` : "—"}</td>
                      <td className="px-4 py-3 text-center text-white/85">{row.pendingCount}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-300">${compactNumber(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Publish queue</h3>
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                {pendingGrades.length} pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingGrades.length === 0 ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                  All caught up. No grades waiting to publish.
                </div>
              ) : (
                pendingGrades.slice(0, 6).map((grade) => (
                  <div key={grade.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                    <p className="font-semibold text-white">{grade.studentName}</p>
                    <p className="mt-1 text-xs text-white/55">{grade.courseName} • {grade.examName}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-white/80">{grade.percentage}%</span>
                      <button
                        disabled={publishingIds.includes(grade.id)}
                        onClick={() => void handlePublishFromQueue(grade.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:from-blue-400 hover:to-cyan-400 disabled:opacity-50"
                      >
                        {publishingIds.includes(grade.id) ? "Publishing..." : "Publish"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/4 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Live activity feed</h3>
              <Activity className="h-4 w-4 text-white/50" />
            </div>

            <div className="space-y-3">
              {activityFeed.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 p-3">
                  <div className="mt-0.5 rounded-lg bg-white/10 p-2">
                    {item.type === "grade" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-white/55">{item.subtitle}</p>
                    <p className="mt-2 text-[11px] text-white/40">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NavigationCard
          title="Grades Management"
          description="View, publish, and manage student grades"
          icon={Award}
          href="/professor/grades"
          color="from-blue-500/20 to-blue-600/20"
        />
        <NavigationCard
          title="Earnings & Payouts"
          description="Track your earnings and payout history"
          icon={DollarSign}
          href="/professor/earnings"
          color="from-green-500/20 to-green-600/20"
        />
        <NavigationCard
          title="Course Analytics"
          description="View engagement metrics and student progress"
          icon={TrendingUp}
          href="/professor/analytics"
          color="from-purple-500/20 to-purple-600/20"
        />
        <NavigationCard
          title="Certifications"
          description="Create templates and issue certificates"
          icon={Award}
          href="/professor/certifications"
          color="from-yellow-500/20 to-yellow-600/20"
        />
        <NavigationCard
          title="Exams & Assessments"
          description="Review exams and manage assessments"
          icon={AlertTriangle}
          href="/professor/exams"
          color="from-red-500/20 to-red-600/20"
        />
        <NavigationCard
          title="Student Directory"
          description="View all enrolled students"
          icon={Users}
          href="/professor/students"
          color="from-indigo-500/20 to-indigo-600/20"
        />
      </div>
    </div>
  );
}

interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

function NavigationCard({ title, description, icon: Icon, href, color }: NavigationCardProps) {
  return (
    <a
      href={href}
      className={`group rounded-xl border border-white/10 bg-linear-to-br ${color} p-4 transition hover:border-white/20 sm:p-6`}
    >
      <div className="mb-3 inline-block rounded-lg bg-white/10 p-2.5 group-hover:bg-white/20">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{description}</p>
    </a>
  );
}

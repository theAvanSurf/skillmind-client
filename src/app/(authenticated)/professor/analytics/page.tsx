"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, TrendingUp, Users, Clock, Zap, BarChart3, Sparkles } from "lucide-react";
import { fetchEngagementMetrics } from "@/features/professor/services/professor-dashboard.service";
import type { EngagementMetrics } from "@/types/professor.types";
import {
  ChartMetricStrip,
  DistributionBarChartCard,
  TrendAreaChartCard,
  compactNumber,
} from "@/features/professor/components/charts/ProfessorCharts";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<EngagementMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEngagementMetrics();
      setMetrics(data);
      if (data.length > 0 && !selectedCourse) {
        setSelectedCourse(data[0].courseId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  const currentMetrics = useMemo(
    () => metrics.find((m) => m.courseId === selectedCourse),
    [metrics, selectedCourse]
  );

  const retentionCurveData = useMemo(() => {
    if (!currentMetrics) return [];

    const orderedDrops = [...currentMetrics.dropOffPoints].sort((a, b) => a.position - b.position);
    let retention = 100;

    return [
      { step: "Start", retention: 100 },
      ...orderedDrops.map((point) => {
        retention = Math.max(currentMetrics.completionRate, retention - point.dropoffPercentage);
        return {
          step: `L${point.position}`,
          retention: Math.round(retention),
        };
      }),
      { step: "Finish", retention: currentMetrics.completionRate },
    ];
  }, [currentMetrics]);

  const rewatchData = useMemo(() => {
    if (!currentMetrics) return [];

    return currentMetrics.mostReWatchedSections.map((section) => ({
      section: section.sectionTitle,
      rewatches: section.reWatchCount,
    }));
  }, [currentMetrics]);

  const summaryChips = useMemo(
    () =>
      currentMetrics
        ? [
            { label: "Avg watch time", value: `${currentMetrics.averageWatchTime}m`, tone: "bg-blue-500/10" },
            { label: "Completion", value: `${currentMetrics.completionRate}%`, tone: "bg-emerald-500/10" },
            { label: "Active", value: `${compactNumber(currentMetrics.activeStudentCount)}`, tone: "bg-violet-500/10" },
            { label: "Questions", value: compactNumber(currentMetrics.questionActivityCount), tone: "bg-amber-500/10" },
          ]
        : [],
    [currentMetrics]
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-5 sm:p-8">
        <div className="h-8 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
            <h2 className="text-lg font-semibold">Unable to load analytics</h2>
          </div>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
          <button
            onClick={() => void loadMetrics()}
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
      {currentMetrics && (
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_24%),linear-gradient(180deg,rgba(8,12,24,0.96),rgba(5,8,16,0.92))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.38)] sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0,transparent_22%,transparent_78%,rgba(255,255,255,0.04)_100%)] opacity-60" />
          <div className="relative grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                <Sparkles className="h-3.5 w-3.5" />
                Analytics workspace
              </div>

              <div>
                <h1 className="max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Course engagement and retention control
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                  Track retention drops, rewatch hotspots, and student activity in one place.
                </p>
              </div>

              <ChartMetricStrip items={summaryChips} />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Total students</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{compactNumber(currentMetrics.totalStudentCount)}</p>
                  <p className="mt-1 text-sm text-blue-300">Across this course</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Drop-off zones</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentMetrics.dropOffPoints.length}</p>
                  <p className="mt-1 text-sm text-rose-300">Needs attention</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Rewatch hotspots</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentMetrics.mostReWatchedSections.length}</p>
                  <p className="mt-1 text-sm text-emerald-300">High friction lessons</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-5">
              <div className="xl:col-span-3">
                <TrendAreaChartCard
                  title="Retention curve"
                  description="Where the audience keeps watching from lesson to lesson."
                  data={retentionCurveData}
                  xKey="step"
                  yKey="retention"
                  stroke="#a78bfa"
                  gradientFrom="rgba(167, 139, 250, 0.72)"
                  gradientTo="rgba(167, 139, 250, 0.02)"
                  yFormatter={(value) => `${value}%`}
                  footer={<p className="text-xs text-white/50">The flatter the curve, the stronger the course flow.</p>}
                />
              </div>
              <div className="xl:col-span-2">
                <DistributionBarChartCard
                  title="Rewatch hotspots"
                  description="Sections students revisit the most often."
                  data={rewatchData}
                  xKey="section"
                  yKey="rewatches"
                  barColor="#38bdf8"
                  yFormatter={(value) => compactNumber(value)}
                  footer={<p className="text-xs text-white/50">Repeated rewatches often point to the most valuable lessons.</p>}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Course Selector */}
      {metrics.length > 1 && (
        <div>
          <label className="block text-sm font-semibold text-white/90">Select Course</label>
          <select
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="mt-2 max-w-xs rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            {metrics.map((m) => (
              <option key={m.courseId} value={m.courseId}>
                {m.courseName}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentMetrics && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Avg Watch Time"
              value={`${currentMetrics.averageWatchTime}m`}
              icon={Clock}
              color="from-blue-500/20 to-blue-600/20"
              trend="per student"
            />
            <MetricCard
              label="Completion Rate"
              value={`${currentMetrics.completionRate}%`}
              icon={TrendingUp}
              color="from-green-500/20 to-green-600/20"
              trend="students finished"
            />
            <MetricCard
              label="Active Students"
              value={`${currentMetrics.activeStudentCount}/${currentMetrics.totalStudentCount}`}
              icon={Users}
              color="from-purple-500/20 to-purple-600/20"
              trend="enrolled"
            />
            <MetricCard
              label="Exercise Participation"
              value={`${currentMetrics.exerciseParticipationRate}%`}
              icon={Zap}
              color="from-yellow-500/20 to-yellow-600/20"
              trend="completion rate"
            />
          </div>

          {/* Drop-off Points */}
          {currentMetrics.dropOffPoints.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Areas of Concern</h2>
              <div className="space-y-3">
                {currentMetrics.dropOffPoints.map((point) => (
                  <div key={point.lessonId} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">{point.lessonTitle}</p>
                        <p className="mt-1 text-xs text-white/50">Lesson {point.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-300">{point.dropoffPercentage}%</p>
                        <p className="mt-1 text-xs text-white/50">students drop off here</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-linear-to-r from-red-400 to-red-500"
                        style={{ width: `${point.dropoffPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Most Re-watched Sections */}
          {currentMetrics.mostReWatchedSections.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Most Re-Watched Sections</h2>
              <div className="space-y-3">
                {currentMetrics.mostReWatchedSections.map((section) => (
                  <div key={section.sectionId} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">{section.sectionTitle}</p>
                        <p className="mt-1 text-xs text-white/50">Avg: {section.averageReWatchTime}m per rewatch</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-300">{section.reWatchCount}</p>
                        <p className="mt-1 text-xs text-white/50">rewatched</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-linear-to-r from-blue-400 to-blue-500"
                        style={{ width: `${Math.min(100, (section.reWatchCount / 150) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Activity */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Discussion & Questions</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/70">Question Activity Count</p>
                  <p className="mt-2 text-3xl font-bold text-white">{currentMetrics.questionActivityCount}</p>
                  <p className="mt-1 text-sm text-white/50">student questions and comments</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: string;
}

function MetricCard({ label, value, icon: Icon, color, trend }: MetricCardProps) {
  return (
    <div className={`rounded-xl border border-white/10 bg-linear-to-br ${color} p-4 sm:p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-white/70">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{value}</p>
          <p className="mt-2 text-xs text-white/50">{trend}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-2.5">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
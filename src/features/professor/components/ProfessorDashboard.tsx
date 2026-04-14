"use client"

import Link from "next/link"
import { BookOpen, Users, DollarSign, Award, AlertTriangle, CheckCircle, ArrowRight, TrendingUp } from "lucide-react"
import StatCard from "./StatCard"
import EarningsChart from "./EarningsChart"
import EnrollmentChart from "./EnrollmentChart"
import { useProfessorDashboard, useEarnings } from "../hooks/useProfessor"

function fmt(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(2)}`
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

export default function ProfessorDashboard() {
  const { data: dash, isLoading: dashLoading, error: dashError } = useProfessorDashboard()
  const { data: earnings, isLoading: earningsLoading } = useEarnings()

  if (dashLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-white/5" />
          <div className="h-64 rounded-2xl bg-white/5" />
        </div>
      </div>
    )
  }

  if (dashError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-400">
        <AlertTriangle size={18} />
        Failed to load dashboard. Please refresh.
      </div>
    )
  }

  const pendingReviews = dash?.pendingExamReviews ?? 0
  const alerts = [
    pendingReviews > 0 && {
      id: "exams",
      type: "warn" as const,
      message: `${pendingReviews} exam submission${pendingReviews > 1 ? "s" : ""} awaiting review`,
      href: "/professor/exams",
    },
    !dash?.courses?.length && {
      id: "courses",
      type: "info" as const,
      message: "Create your first course to start earning",
      href: "/professor/courses",
    },
  ].filter(Boolean) as { id: string; type: "warn" | "info"; message: string; href: string }[]

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">Overview of your teaching activity</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Link
              key={alert.id}
              href={alert.href}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition hover:opacity-80 ${
                alert.type === "warn"
                  ? "border-amber-500/20 bg-amber-500/8 text-amber-400"
                  : "border-blue-500/20 bg-blue-500/8 text-blue-400"
              }`}
            >
              {alert.type === "warn" ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
              <span className="flex-1">{alert.message}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={dash?.totalStudents ?? 0}
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          subtitle={`${dash?.activeStudents ?? 0} active`}
        />
        <StatCard
          label="Total Earnings"
          value={fmt(dash?.totalEarnings ?? 0)}
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          subtitle={`${fmt(dash?.earningsThisMonth ?? 0)} this month`}
        />
        <StatCard
          label="Courses"
          value={dash?.totalCourses ?? 0}
          icon={BookOpen}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
          subtitle="published"
        />
        <StatCard
          label="Completion Rate"
          value={pct(dash?.courseCompletionRate ?? 0)}
          icon={TrendingUp}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          subtitle={`${dash?.certificatesIssued ?? 0} certificates issued`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings chart */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Monthly Earnings</p>
              <p className="text-xs text-white/35">Last 12 months</p>
            </div>
            <Link href="/professor/earnings" className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
              Details <ArrowRight size={12} />
            </Link>
          </div>
          {earningsLoading ? (
            <div className="h-48 animate-pulse rounded-xl bg-white/5" />
          ) : earnings?.monthly?.length ? (
            <EarningsChart data={earnings.monthly} />
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-white/25">No earnings data yet</div>
          )}
        </div>

        {/* Enrollment chart */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Enrollment by Course</p>
              <p className="text-xs text-white/35">Students per course</p>
            </div>
            <Link href="/professor/courses" className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          {dash?.courses?.length ? (
            <EnrollmentChart courses={dash.courses} />
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-white/25">No courses yet</div>
          )}
        </div>
      </div>

      {/* Course table */}
      {dash?.courses && dash.courses.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <p className="text-sm font-semibold text-white">Course Performance</p>
            <Link href="/professor/courses" className="text-xs text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
              All courses <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs text-white/30">
                  <th className="px-5 py-3 font-medium">Course</th>
                  <th className="px-5 py-3 font-medium">Students</th>
                  <th className="px-5 py-3 font-medium">Progress</th>
                  <th className="px-5 py-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {dash.courses.slice(0, 5).map((c) => (
                  <tr key={c.courseId} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition">
                    <td className="px-5 py-3 text-white/80 font-medium max-w-48 truncate">{c.title}</td>
                    <td className="px-5 py-3 text-white/50">{c.enrolledStudents}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${Math.min(c.averageProgress * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/35">{pct(c.averageProgress)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-emerald-400 font-medium">{fmt(c.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!dash?.courses || dash.courses.length === 0) && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <BookOpen size={32} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm font-semibold text-white/50">No courses yet</p>
          <p className="mt-1 text-xs text-white/25">Create your first course to see analytics here</p>
          <Link
            href="/professor/courses"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
          >
            Create course <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}

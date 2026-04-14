"use client"

import { DollarSign, TrendingUp, Clock, CreditCard, ExternalLink, AlertTriangle, Loader2 } from "lucide-react"
import { useEarnings, useStripeStatus } from "../hooks/useProfessor"
import EarningsChart from "./EarningsChart"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"]

function fmt(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  return `$${n.toFixed(2)}`
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-[#12121a] px-3 py-2 text-xs shadow-lg">
      <p className="text-white/50 mb-1">{payload[0].name}</p>
      <p className="font-semibold text-white">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function EarningsPage() {
  const { data: earnings, isLoading: earningsLoading } = useEarnings()
  const { data: stripeStatus, isLoading: stripeLoading } = useStripeStatus()

  if (earningsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 gap-4">{[...Array(2)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/5" />)}</div>
        <div className="h-64 rounded-2xl bg-white/5" />
      </div>
    )
  }

  const pieData = earnings?.byCourse
    .filter((c) => c.revenue > 0)
    .map((c) => ({ name: c.courseTitle, value: c.revenue })) ?? []

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="mt-1 text-sm text-white/40">Revenue overview and payout status</p>
      </div>

      {/* Stripe Connect status */}
      <div className={`rounded-2xl border p-5 ${
        stripeStatus?.payoutsEnabled
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            stripeStatus?.payoutsEnabled ? "bg-emerald-500/15" : "bg-amber-500/15"
          }`}>
            <CreditCard size={20} className={stripeStatus?.payoutsEnabled ? "text-emerald-400" : "text-amber-400"} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              Stripe Connect — {stripeLoading ? "…" : stripeStatus?.payoutStatus ?? "Not connected"}
            </p>
            <p className="mt-0.5 text-xs text-white/45">
              {stripeStatus?.payoutsEnabled
                ? "Payouts are enabled. Funds are transferred automatically."
                : "Complete Stripe onboarding to enable payouts to your bank account."}
            </p>
          </div>
          {!stripeStatus?.payoutsEnabled && (
            <button className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600">
              <ExternalLink size={14} /> Complete setup
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 mb-4">
            <DollarSign size={18} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{fmt(earnings?.totalEarnings ?? 0)}</p>
          <p className="mt-0.5 text-sm text-white/45">Total Earnings</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 mb-4">
            <Clock size={18} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{fmt(earnings?.pendingPayout ?? 0)}</p>
          <p className="mt-0.5 text-sm text-white/45">Pending Payout</p>
        </div>
      </div>

      {/* Monthly earnings chart */}
      {earnings?.monthly && earnings.monthly.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <p className="text-sm font-semibold text-white mb-4">Monthly Earnings</p>
          <EarningsChart data={earnings.monthly} />
        </div>
      )}

      {/* Revenue by course */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        {pieData.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <p className="text-sm font-semibold text-white mb-4">Revenue by Course</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-white/50 max-w-24 truncate">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Course earnings table */}
        {earnings?.byCourse && earnings.byCourse.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <p className="text-sm font-semibold text-white">Per-course Breakdown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left text-xs text-white/30">
                    <th className="px-5 py-3 font-medium">Course</th>
                    <th className="px-5 py-3 font-medium">Students</th>
                    <th className="px-5 py-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.byCourse.map((c) => (
                    <tr key={c.courseId} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-3 text-white/70 max-w-40 truncate">{c.courseTitle}</td>
                      <td className="px-5 py-3 text-white/45">{c.enrollmentCount}</td>
                      <td className="px-5 py-3 text-emerald-400 font-semibold">{fmt(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!earnings?.totalEarnings && (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <TrendingUp size={36} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm font-semibold text-white/50">No earnings yet</p>
          <p className="mt-1 text-xs text-white/25">Publish a course and enroll students to start earning</p>
        </div>
      )}
    </div>
  )
}

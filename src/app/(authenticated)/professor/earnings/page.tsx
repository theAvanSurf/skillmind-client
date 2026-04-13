"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, TrendingUp, DollarSign, Check, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { fetchEarningsBreakdown, fetchPayoutHistory } from "@/features/professor/services/professor-dashboard.service";
import type { EarningsBreakdown, PayoutHistory, Payout } from "@/types/professor.types";
import {
  ChartMetricStrip,
  DonutChartCard,
  TrendAreaChartCard,
  compactNumber,
} from "@/features/professor/components/charts/ProfessorCharts";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<EarningsBreakdown | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [earningsData, payoutData] = await Promise.all([
        fetchEarningsBreakdown(),
        fetchPayoutHistory(),
      ]);

      setEarnings(earningsData);
      setPayoutHistory(payoutData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load earnings data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const payoutTrendData = useMemo(() => {
    return (payoutHistory?.payouts ?? [])
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((payout) => ({
        date: new Date(payout.date).toLocaleDateString([], { month: "short", day: "numeric" }),
        amount: payout.amount,
      }));
  }, [payoutHistory]);

  const courseMixData = useMemo(() => {
    const courseLabels: Record<string, string> = {
      "course-001": "React Performance Mastery",
      "course-002": "Advanced TypeScript",
      "course-003": "Web Dev 101",
    };

    return Object.entries(earnings?.perCourse ?? {}).map(([courseId, amount]) => ({
      name: courseLabels[courseId] ?? courseId,
      value: amount,
    }));
  }, [earnings]);

  const summaryChips = useMemo(
    () =>
      earnings
        ? [
            { label: "Total earnings", value: `$${compactNumber(earnings.totalEarnings)}`, tone: "bg-emerald-500/10" },
            { label: "Platform fees", value: `$${compactNumber(earnings.platformFees)}`, tone: "bg-rose-500/10" },
            { label: "Net amount", value: `$${compactNumber(earnings.netAmount)}`, tone: "bg-blue-500/10" },
            { label: "Pending", value: `$${compactNumber(earnings.pendingAmount)}`, tone: "bg-amber-500/10" },
          ]
        : [],
    [earnings]
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
            <h2 className="text-lg font-semibold">Unable to load earnings data</h2>
          </div>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
          <button
            onClick={() => void loadData()}
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
      {earnings && payoutHistory && (
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_24%),linear-gradient(180deg,rgba(8,12,24,0.96),rgba(5,8,16,0.92))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.38)] sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0,transparent_22%,transparent_78%,rgba(255,255,255,0.04)_100%)] opacity-60" />
          <div className="relative grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                <Sparkles className="h-3.5 w-3.5" />
                Earnings workspace
              </div>

              <div>
                <h1 className="max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Payout operations and revenue health
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
                  Monitor cashflow, payout status, and earnings mix across your courses.
                </p>
              </div>

              <ChartMetricStrip items={summaryChips} />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Paid out</p>
                  <p className="mt-2 text-2xl font-semibold text-white">${compactNumber(payoutHistory.totalPaid)}</p>
                  <p className="mt-1 text-sm text-emerald-300">Already in the bank</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Pending payout</p>
                  <p className="mt-2 text-2xl font-semibold text-white">${compactNumber(payoutHistory.totalPending)}</p>
                  <p className="mt-1 text-sm text-amber-300">Scheduled soon</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Next payout</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{payoutHistory.nextPayoutDate ? new Date(payoutHistory.nextPayoutDate).toLocaleDateString() : "—"}</p>
                  <p className="mt-1 text-sm text-blue-300">Projected release</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-5">
              <div className="xl:col-span-3">
                <TrendAreaChartCard
                  title="Payout momentum"
                  description="Watch how revenue moves through your payout cycle."
                  data={payoutTrendData}
                  xKey="date"
                  yKey="amount"
                  stroke="#34d399"
                  gradientFrom="rgba(52, 211, 153, 0.75)"
                  gradientTo="rgba(52, 211, 153, 0.02)"
                  yFormatter={(value) => `$${compactNumber(value)}`}
                  footer={<p className="text-xs text-white/50">Revenue lands smoother when the payout pipeline is visible.</p>}
                />
              </div>
              <div className="xl:col-span-2">
                <DonutChartCard
                  title="Revenue mix"
                  description="How your earnings are split across courses."
                  data={courseMixData}
                  nameKey="name"
                  valueKey="value"
                  colors={["#22c55e", "#60a5fa", "#f59e0b"]}
                  footer={<p className="text-xs text-white/50">This is the shape of the business you’ve built.</p>}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payout Status */}
      {payoutHistory && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payout Status</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <PayoutStatusCard
              label="Pending Payouts"
              amount={payoutHistory.totalPending}
              icon={Clock}
              color="from-yellow-500/20 to-yellow-600/20"
              textColor="text-yellow-300"
            />
            <PayoutStatusCard
              label="Total Paid"
              amount={payoutHistory.totalPaid}
              icon={Check}
              color="from-green-500/20 to-green-600/20"
              textColor="text-green-300"
            />
            <PayoutStatusCard
              label="Next Payout"
              amount={payoutHistory.nextPayoutDate ? new Date(payoutHistory.nextPayoutDate).toLocaleDateString() : "N/A"}
              icon={TrendingUp}
              color="from-blue-500/20 to-blue-600/20"
              textColor="text-blue-300"
            />
          </div>
        </div>
      )}

      {/* Payout History Table */}
      {payoutHistory && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment History</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/4">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="bg-white/5">
                  <th className="px-4 py-3 text-left font-semibold text-white">Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-white">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Method</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {payoutHistory.payouts.map((payout) => (
                  <PayoutRow key={payout.id} payout={payout} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Earnings per Course */}
      {earnings && Object.keys(earnings.perCourse).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Earnings by Course</h2>
          <div className="space-y-3">
            {Object.entries(earnings.perCourse)
              .sort(([, a], [, b]) => b - a)
              .map(([courseId, amount]) => (
                <div key={courseId} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{courseId}</p>
                      <p className="mt-1 text-xs text-white/50">Revenue share by course</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-300">${amount.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-white/50">
                        {((amount / earnings.totalEarnings) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-linear-to-r from-green-400 to-green-500"
                      style={{ width: `${(amount / earnings.totalEarnings) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface EarningsCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: string;
}

function EarningsCard({ label, value, icon: Icon, color, trend }: EarningsCardProps) {
  return (
    <div className={`rounded-xl border border-white/10 bg-linear-to-br ${color} p-4 sm:p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-white/70">{label}</p>
          <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">{value}</p>
          <p className="mt-2 text-xs text-white/50">{trend}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-2.5">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

interface PayoutStatusCardProps {
  label: string;
  amount: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
}

function PayoutStatusCard({ label, amount, icon: Icon, color, textColor }: PayoutStatusCardProps) {
  const displayAmount = typeof amount === "number" ? `$${amount.toLocaleString()}` : amount;

  return (
    <div className={`rounded-xl border border-white/10 bg-linear-to-br ${color} p-4 sm:p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-white/70">{label}</p>
          <p className={`mt-2 text-xl font-bold sm:text-2xl ${textColor}`}>{displayAmount}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-2.5">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function PayoutRow({ payout }: { payout: Payout }) {
  const statusConfig = {
    paid: { bg: "bg-green-500/20", text: "text-green-300", label: "Paid" },
    processing: { bg: "bg-blue-500/20", text: "text-blue-300", label: "Processing" },
    pending: { bg: "bg-yellow-500/20", text: "text-yellow-300", label: "Pending" },
    failed: { bg: "bg-red-500/20", text: "text-red-300", label: "Failed" },
  };

  const config = statusConfig[payout.status];

  return (
    <tr className="hover:bg-white/8 transition">
      <td className="px-4 py-3 text-white">{new Date(payout.date).toLocaleDateString()}</td>
      <td className="px-4 py-3 text-right font-semibold text-white">${payout.amount.toLocaleString()}</td>
      <td className="px-4 py-3 text-white/80 capitalize">{payout.method?.replace("_", " ") || "N/A"}</td>
      <td className="px-4 py-3">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
          {config.label}
        </span>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-white/60">{payout.transactionId || "—"}</td>
    </tr>
  );
}

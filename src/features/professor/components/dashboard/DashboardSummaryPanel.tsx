"use client";

import { useMemo } from "react";
import { TrendingUp, Users, Zap, DollarSign } from "lucide-react";
import type { DashboardSummary } from "@/types/professor.types";

interface DashboardSummaryPanelProps {
  summary: DashboardSummary;
}

export default function DashboardSummaryPanel({ summary }: DashboardSummaryPanelProps) {
  const statCards = useMemo(
    () => [
      {
        label: "Total Students",
        value: summary.totalStudentsEnrolled.toLocaleString(),
        icon: Users,
        color: "from-blue-500/20 to-blue-600/20",
        trend: "+12% this month",
      },
      {
        label: "Active Students",
        value: summary.activeStudents.toLocaleString(),
        icon: Zap,
        color: "from-green-500/20 to-green-600/20",
        trend: "+8% from last week",
      },
      {
        label: "Completion Rate",
        value: `${summary.courseCompletionRate}%`,
        icon: TrendingUp,
        color: "from-purple-500/20 to-purple-600/20",
        trend: "-2% from average",
      },
      {
        label: "Total Earnings",
        value: `$${summary.totalEarnings.toLocaleString()}`,
        icon: DollarSign,
        color: "from-yellow-500/20 to-yellow-600/20",
        trend: `$${summary.pendingPayouts} pending`,
      },
    ],
    [summary]
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Card = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-xl border border-white/10 bg-linear-to-br ${card.color} p-4 sm:p-6`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-white/70">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">{card.value}</p>
                  <p className="mt-2 text-xs text-white/50">{card.trend}</p>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5">
                  <Card className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

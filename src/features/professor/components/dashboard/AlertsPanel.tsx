"use client";

import { AlertTriangle, AlertCircle, Zap, X } from "lucide-react";
import type { DashboardAlert } from "@/types/professor.types";

interface AlertsPanelProps {
  alerts: DashboardAlert[];
  onRetry: () => void;
}

export default function AlertsPanel({ alerts, onRetry }: AlertsPanelProps) {
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");
  const infoAlerts = alerts.filter((a) => a.severity === "info" && !a.readAt);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {criticalAlerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} type="critical" />
      ))}
      {warningAlerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} type="warning" />
      ))}
      {infoAlerts.slice(0, 2).map((alert) => (
        <AlertItem key={alert.id} alert={alert} type="info" />
      ))}
    </div>
  );
}

interface AlertItemProps {
  alert: DashboardAlert;
  type: "critical" | "warning" | "info";
}

function AlertItem({ alert, type }: AlertItemProps) {
  const iconMap = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: Zap,
  };

  const colorMap = {
    critical: "border-red-500/25 bg-red-500/10",
    warning: "border-yellow-500/25 bg-yellow-500/10",
    info: "border-blue-500/25 bg-blue-500/10",
  };

  const Icon = iconMap[type];
  const textColorMap = {
    critical: "text-red-300",
    warning: "text-yellow-300",
    info: "text-blue-300",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[type]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={`h-5 w-5 ${textColorMap[type]} mt-0.5 shrink-0`} />
          <div className="min-w-0 flex-1">
            <p className={`font-semibold ${textColorMap[type]}`}>{alert.title}</p>
            <p className="mt-1 text-sm text-white/70">{alert.description}</p>
            {alert.actionUrl && (
              <a
                href={alert.actionUrl}
                className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/25"
              >
                {alert.actionLabel || "View Details"}
              </a>
            )}
          </div>
        </div>
        <button className="ml-3 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

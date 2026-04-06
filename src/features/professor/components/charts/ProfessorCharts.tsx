"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartValue = string | number;
type ChartDatum = Record<string, ChartValue>;

const tooltipStyles = {
  background: "rgba(9, 9, 14, 0.96)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: 14,
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
  color: "#fff",
};

function numberValue(value: ChartValue | undefined): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function ChartShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_30%)]" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
            {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
          </div>
        </div>
        <div className="relative h-[280px]">{children}</div>
        {footer && <div className="relative border-t border-white/10 pt-4">{footer}</div>}
      </div>
    </div>
  );
}

function DarkTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: ChartValue; name?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={tooltipStyles} className="min-w-[160px] px-3 py-2">
      {label && <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>}
      {payload.map((entry, index) => (
        <div key={`${entry.name ?? "value"}-${index}`} className="mt-1 flex items-center justify-between gap-4 text-sm">
          <span className="text-white/70">{entry.name ?? "Value"}</span>
          <span className="font-semibold text-white">{entry.value ?? 0}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendAreaChartCard({
  title,
  description,
  data,
  xKey,
  yKey,
  stroke = "#60a5fa",
  gradientFrom = "rgba(96, 165, 250, 0.55)",
  gradientTo = "rgba(96, 165, 250, 0.02)",
  yFormatter,
  footer,
}: {
  title: string;
  description?: string;
  data: ChartDatum[];
  xKey: string;
  yKey: string;
  stroke?: string;
  gradientFrom?: string;
  gradientTo?: string;
  yFormatter?: (value: number) => string;
  footer?: React.ReactNode;
}) {
  const gradientId = useId();

  return (
    <ChartShell title={title} description={description} footer={footer}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientFrom} stopOpacity={1} />
              <stop offset="95%" stopColor={gradientTo} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
            tickFormatter={yFormatter}
          />
          <Tooltip content={<DarkTooltip />} />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={stroke}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function DistributionBarChartCard({
  title,
  description,
  data,
  xKey,
  yKey,
  barColor = "#7c3aed",
  footer,
  yFormatter,
}: {
  title: string;
  description?: string;
  data: ChartDatum[];
  xKey: string;
  yKey: string;
  barColor?: string;
  footer?: React.ReactNode;
  yFormatter?: (value: number) => string;
}) {
  const gradientId = useId();

  return (
    <ChartShell title={title} description={description} footer={footer}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity={0.95} />
              <stop offset="100%" stopColor={barColor} stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
            tickFormatter={yFormatter}
          />
          <Tooltip content={<DarkTooltip />} />
          <Bar dataKey={yKey} fill={`url(#${gradientId})`} radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function DonutChartCard({
  title,
  description,
  data,
  nameKey,
  valueKey,
  colors,
  footer,
}: {
  title: string;
  description?: string;
  data: ChartDatum[];
  nameKey: string;
  valueKey: string;
  colors: string[];
  footer?: React.ReactNode;
}) {
  const total = data.reduce((sum, item) => sum + numberValue(item[valueKey]), 0);

  return (
    <ChartShell title={title} description={description} footer={footer}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<DarkTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={24}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-white/65">{value}</span>}
          />
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            innerRadius={68}
            outerRadius={102}
            paddingAngle={4}
            stroke="rgba(0,0,0,0.25)"
          >
            {data.map((entry, index) => (
              <Cell key={`slice-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+12px)] text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Total</p>
        <p className="mt-1 text-2xl font-bold text-white">{total}</p>
      </div>
    </ChartShell>
  );
}

export function ChartMetricStrip({ items }: { items: Array<{ label: string; value: string; tone: string }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={`rounded-2xl border border-white/10 ${item.tone} p-4 shadow-lg shadow-black/20`}>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

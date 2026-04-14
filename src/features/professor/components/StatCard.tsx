import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  trend?: { value: number; label: string }
  subtitle?: string
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-blue-400",
  iconBg = "bg-blue-500/10",
  trend,
  subtitle,
}: StatCardProps) {
  const trendPositive = trend && trend.value >= 0

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/12">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendPositive ? "text-emerald-400" : "text-red-400"}`}>
            {trendPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="mt-0.5 text-sm text-white/45">{label}</p>
        {subtitle && <p className="mt-1 text-xs text-white/25">{subtitle}</p>}
        {trend && <p className="mt-1 text-[11px] text-white/25">{trend.label}</p>}
      </div>
    </div>
  )
}

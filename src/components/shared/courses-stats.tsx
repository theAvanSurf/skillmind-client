import { ReactNode } from "react";

export type CourseStatItem = {
  icon?: ReactNode;
  label: string;
  value: string | number;
};

type StatCardProps = CourseStatItem & {
  iconClassName?: string;
};

type CourseStatsProps = {
  stats?: CourseStatItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  cardIconClassName?: string;
};

export const StatCard = ({ icon, label, value, iconClassName }: StatCardProps) => (
  <div className="flex items-center gap-3 rounded-lg bg-white/40 px-4 py-3 backdrop-blur-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60">
      {icon ? <span className={iconClassName}>{icon}</span> : null}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-white/90">{label}</span>
      <span className="text-lg font-bold text-white">{value}</span>
    </div>
  </div>
);

const CourseStats = ({
  stats = [],
  title = "My Courses",
  subtitle = "Track your learning journey and achieve your goals",
  className = "",
  cardIconClassName = "text-orange-500",
}: CourseStatsProps) => {
  return (
    <div className={`w-full rounded-2xl bg-linear-to-r from-orange-400 to-orange-500 p-6 shadow-lg ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-white/80">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            iconClassName={cardIconClassName}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseStats;
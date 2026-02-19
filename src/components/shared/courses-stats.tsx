import type { CourseStatItem } from "@/types/course.types";

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
  <div className="flex items-center gap-3.5 rounded-xl bg-white/15 px-4 py-3.5 backdrop-blur-sm">
    {icon && (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
        <span className={iconClassName ?? "text-white"}>{icon}</span>
      </div>
    )}
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-white/70">{label}</span>
      <span className="text-xl font-bold leading-none text-white">{value}</span>
    </div>
  </div>
);

const CourseStats = ({
  stats = [],
  title = "My Courses",
  subtitle = "Track your learning journey and achieve your goals",
  className = "",
  cardIconClassName = "text-white",
}: CourseStatsProps) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 p-6 shadow-lg shadow-orange-500/20 ${className}`}
    >
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
      </div>

      <div className="relative mb-5">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-0.5 text-sm text-white/65">{subtitle}</p>
      </div>

      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
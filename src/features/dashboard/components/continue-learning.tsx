import { Play, Clock } from "lucide-react";

interface ContinueLearningProps {
  title: string;
  subtitle?: string;
  courses: Array<{
    id: number | string;
    title: string;
    duration: string;
  }>;
}

export default function ContinueLearning({ title, subtitle, courses }: ContinueLearningProps) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-white/40">{subtitle}</p>}
        </div>
        <button
          type="button"
          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07]"
          >
            <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500/10 to-sky-500/5">
                <div className="rounded-full bg-white/10 p-3 ring-1 ring-blue-500/20">
                  <Play className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <div className="p-4">
              <h3 className="mb-2.5 text-sm font-semibold leading-snug text-white line-clamp-2">
                {course.title}
              </h3>
              <div className="mb-3 flex items-center gap-1 text-[11px] text-white/35">
                <Clock className="h-3.5 w-3.5" />
                <span>{course.duration} left</span>
              </div>
              <button className="w-full rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:from-blue-600 hover:to-blue-700">
                Continue learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
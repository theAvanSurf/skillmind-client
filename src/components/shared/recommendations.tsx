import { Clock, BookOpen } from "lucide-react";

interface RecommendationsProps {
  title: string;
  subtitle?: string;
  courses: Array<{
    id: number | string;
    title: string;
    duration: string;
    category: string;
  }>;
}

export default function Recommendations({ title, subtitle, courses }: RecommendationsProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <span className="text-sm font-medium text-orange-600 hover:text-orange-700 cursor-pointer">View all</span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
                event.preventDefault();
                event.currentTarget.click();
              }
            }}
          >
            <div className="relative h-40 w-full overflow-hidden bg-gray-100">
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
                {course.category}
              </div>
              <div className="flex h-full w-full items-center justify-center">
                <div className="rounded-full bg-white/90 p-3 shadow-sm">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="mb-3 text-base font-semibold text-gray-800 line-clamp-2">{course.title}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{course.duration}</span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-linear-to-r from-yellow-500 to-orange-500 px-3 py-2.5 text-sm font-medium text-white shadow transition hover:opacity-90">
                Start course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
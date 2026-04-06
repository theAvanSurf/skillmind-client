import React from "react";
import { Clock, BookOpen } from "lucide-react";

type CourseCardProps = {
  title: string;
  image: string;
  progress: number;
  duration: string;
  lessons: number;
  category?: string;
  onClick?: () => void;
};

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  image,
  progress,
  duration,
  lessons,
  category,
  onClick,
}) => {
  const isComplete = progress >= 100;

  return (
    <div
      className="group relative cursor-pointer overflow-visible rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:z-50"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Course Image */}
      <div className="relative h-40 w-full overflow-hidden bg-white/6">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        {category && (
          <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {category}
          </div>
        )}
        {isComplete && (
          <div className="absolute right-3 top-3 rounded-full bg-green-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Completed
          </div>
        )}
      </div>

      {/* Hover info overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end rounded-2xl bg-black/80 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h4 className="mb-2 text-sm font-semibold text-white">{title}</h4>

        <p className="mb-2 text-xs text-gray-300">
          {lessons} lessons • {duration}
        </p>

        {progress > 0 ? (
          <>
            <div className="h-1.5 w-full rounded-full bg-gray-600">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-blue-400">Continue Watching</p>
          </>
        ) : (
          <p className="mt-1 text-xs text-white/70">Start Course</p>
        )}
      </div>

      {/* Course Info */}
      <div className="p-4">
        <h3 className="mb-2 text-sm font-semibold leading-snug text-white line-clamp-2">
          {title}
        </h3>

        {progress > 0 && !isComplete && (
          <p className="mb-2 text-xs font-medium text-blue-400">
            Continue Watching
          </p>
        )}

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-400">Progress</span>
              <span
                className={`text-[11px] font-bold ${
                  isComplete ? "text-green-400" : "text-white/70"
                }`}
              >
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isComplete
                    ? "bg-linear-to-r from-green-400 to-green-500"
                    : "bg-linear-to-r from-blue-400 to-blue-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3.5 text-[11px] text-white/35">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {lessons} lessons
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
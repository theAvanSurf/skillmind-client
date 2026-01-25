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
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
      onClick={onClick}
    >
      {/* Course Image */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {category && (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            {category}
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-4">
        <h3 className="mb-3 text-base font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className="text-xs font-bold text-gray-700">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{lessons} lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
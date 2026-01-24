import React from "react";
import { Calendar } from "lucide-react";

type ProjectCardProps = {
  title: string;
  courseName: string;
  dueDate: string;
  onClick?: () => void;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  courseName,
  dueDate,
  onClick,
}) => {
  return (
    <div
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300"
      onClick={onClick}
    >
      {/* Project Title */}
      <h3 className="mb-2 text-sm font-semibold text-gray-900 line-clamp-1">
        {title}
      </h3>

      {/* Course Name */}
      <p className="mb-3 text-xs text-gray-600 line-clamp-1">
        {courseName}
      </p>

      {/* Due Date */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Calendar className="h-3.5 w-3.5" />
        <span>Due Date: {dueDate}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
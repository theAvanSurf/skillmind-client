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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="group cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.07]"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {/* Project Title */}
      <h3 className="mb-2 text-sm font-semibold text-white line-clamp-1">
        {title}
      </h3>

      {/* Course Name */}
      <p className="mb-3 text-xs text-white/50 line-clamp-1">
        {courseName}
      </p>

      {/* Due Date */}
      <div className="flex items-center gap-1.5 text-xs text-white/40">
        <Calendar className="h-3.5 w-3.5" />
        <span>Due Date: {dueDate}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
import React from "react";
import ProjectCard from "./project-card";
import type { Project } from "@/types/course.types";

export type { Project };

type PendingProjectsProps = {
  projects: Project[];
  title?: string;
  onProjectClick?: (project: Project) => void;
};

const PendingProjects: React.FC<PendingProjectsProps> = ({
  projects,
  title = "Pending Projects",
  onProjectClick,
}) => {
  return (
    <div className="w-full">
      {/* Section Title */}
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            courseName={project.courseName}
            dueDate={project.dueDate}
            onClick={() => onProjectClick?.(project)}
          />
        ))}
      </div>
    </div>
  );
};

export default PendingProjects;
import React from "react";
import CourseCard from "./course-card";
import type { Course } from "@/types/course.types";

export type { Course };

type CourseGridProps = {
  courses: Course[];
  onCourseClick?: (course: Course) => void;
};

const CourseGrid: React.FC<CourseGridProps> = ({ courses, onCourseClick }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          title={course.title}
          image={course.image}
          progress={course.progress}
          duration={course.duration}
          lessons={course.lessons}
          category={course.category}
          onClick={() => onCourseClick?.(course)}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
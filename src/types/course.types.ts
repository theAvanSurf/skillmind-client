import type { ReactNode } from "react";

export interface Course {
  id: string;
  title: string;
  image: string;
  progress: number;
  duration: string;
  lessons: number;
  category?: string;
}

export interface CourseStatItem {
  icon?: ReactNode;
  label: string;
  value: string | number;
}

export interface Project {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
}

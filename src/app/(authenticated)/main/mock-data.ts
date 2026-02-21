import type { CourseStatItem } from "@/types/course.types";

export const statItems: CourseStatItem[] = [
  { label: "Active Courses", value: 5 },
  { label: "Average Progress", value: "68%" },
  { label: "Daily Streak", value: 6 },
  { label: "Completed Projects", value: 12 },
];

export const inProgressCourses = [
  {
    title: "Advanced React Patterns",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    progress: 64,
    duration: "12h 30m",
    lessons: 32,
    category: "Frontend",
  },
  {
    title: "TypeScript Essentials",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    progress: 42,
    duration: "8h 10m",
    lessons: 21,
    category: "Backend",
  },
  {
    title: "UI/UX for Developers",
    image: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    progress: 78,
    duration: "6h 45m",
    lessons: 18,
    category: "Design",
  },
];

export const completedCourses = [
  {
    title: "JavaScript Mastery",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    progress: 100,
    duration: "10h 00m",
    lessons: 28,
    category: "Frontend",
  },
  {
    title: "API Design with Node",
    image: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80",
    progress: 100,
    duration: "7h 20m",
    lessons: 16,
    category: "Backend",
  },
];
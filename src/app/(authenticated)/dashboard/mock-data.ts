import type { CourseStatItem } from "@/types/course.types";

export const statItems: Omit<CourseStatItem, "icon">[] = [
  { label: "Active Courses", value: 5 },
  { label: "Average Progress", value: "68%" },
  { label: "Daily Streak", value: 6 },
  { label: "Completed Projects", value: 12 },
];

export const inProgressCourses = [
  {
    id: "cw1",
    title: "Advanced React Patterns",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    progress: 64,
    duration: "12h 30m",
    lessons: 32,
    category: "Frontend",
  },
  {
    id: "cw2",
    title: "TypeScript Essentials",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    progress: 42,
    duration: "8h 10m",
    lessons: 24,
    category: "Languages",
  },
  {
    id: "cw5",
    title: "Node.js & REST APIs",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    progress: 21,
    duration: "10h 45m",
    lessons: 28,
    category: "Backend",
  },
];

export const completedCourses = [
  {
    id: "by4",
    title: "HTML & CSS Fundamentals",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=1200&q=80",
    progress: 100,
    duration: "6h 20m",
    lessons: 18,
    category: "Web",
  },
  {
    id: "by1",
    title: "JavaScript Basics",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    progress: 100,
    duration: "9h 05m",
    lessons: 26,
    category: "Languages",
  },
];
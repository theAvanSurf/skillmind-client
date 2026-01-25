"use client"
import { BookOpen, CheckCircle2, Flame, FolderOpen, TrendingUp } from "lucide-react";

import CourseCard from "@/src/components/shared/course-card";
import CourseStats, { CourseStatItem } from "@/src/components/shared/courses-stats";
import { statItems as statBase, inProgressCourses, completedCourses } from "./mock-data";

const statItemsWithIcons: CourseStatItem[] = statBase.map((item) => {
  switch (item.label) {
    case "Active Courses":
      return { ...item, icon: (<BookOpen className="h-5 w-5" />) };
    case "Average Progress":
      return { ...item, icon: (<TrendingUp className="h-5 w-5" />) };
    case "Daily Streak":
      return { ...item, icon: (<Flame className="h-5 w-5" />) };
    case "Completed Projects":
      return { ...item, icon: (<FolderOpen className="h-5 w-5" />) };
    default:
      return item;
  }
});

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xl font-medium text-orange-600">Welcome back</p>
          <p className="text-sm text-gray-600">
            Track your learning, resume courses, and see what to tackle next.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:shadow">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Resume last course
          </button>
          <button className="rounded-lg bg-linear-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-xl">
            New course
          </button>
        </div>
      </header>

      <CourseStats
        stats={statItemsWithIcons}
        title="Learning overview"
        subtitle="Your current learning snapshot"
        cardIconClassName="text-orange-500"
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">In progress</h2>
            <p className="text-sm text-gray-600">Pick up where you left off</p>
          </div>
          <button className="text-sm font-medium text-orange-600 hover:text-orange-700">View all</button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inProgressCourses.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Completed</h2>
            <p className="text-sm text-gray-600">Your recent completions</p>
          </div>
          <button className="text-sm font-medium text-orange-600 hover:text-orange-700">View certificates</button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {completedCourses.map((course) => (
            <CourseCard key={course.title} {...course} progress={100} />
          ))}
        </div>
      </section>
    </div>
  );
}

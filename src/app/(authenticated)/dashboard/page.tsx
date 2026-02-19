"use client"
import { BookOpen, CheckCircle2, Flame, FolderOpen, TrendingUp } from "lucide-react";

import CourseCard from "@/components/shared/course-card";
import CourseStats from "@/components/shared/courses-stats";
import type { CourseStatItem } from "@/types/course.types";
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
          <p className="text-xl font-medium text-orange-400">Welcome back</p>
          <p className="text-sm text-white/40">
            Track your learning, resume courses, and see what to tackle next.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-white/70 backdrop-blur-sm transition hover:bg-white/[0.09]">
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
        cardIconClassName="text-white/90"
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">In progress</h2>
            <p className="text-sm text-white/40">Pick up where you left off</p>
          </div>
          <button className="text-sm font-medium text-orange-400 hover:text-orange-300">View all</button>
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
            <h2 className="text-xl font-semibold text-white">Completed</h2>
            <p className="text-sm text-white/40">Your recent completions</p>
          </div>
          <button className="text-sm font-medium text-orange-400 hover:text-orange-300">View certificates</button>
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

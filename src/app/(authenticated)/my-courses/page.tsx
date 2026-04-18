'use client'
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Play, BookOpen, Loader2, AlertTriangle, Award } from "lucide-react";
import { getEnrolledCourses } from "@/features/courses/services/course-details.service";
import { browseCourses } from "@/features/courses/services/browse-courses.service";
import Recommendations from "@/features/dashboard/components/recommendations";

export default function MyCoursesPage() {
  const router = useRouter();

  const { data: enrolled, isLoading, error } = useQuery({
    queryKey: ["courses", "my-enrollments"],
    queryFn: getEnrolledCourses,
  });

  const { data: browsed } = useQuery({
    queryKey: ["courses", "browse", "my-courses"],
    queryFn: () => browseCourses({ pageSize: 6, sort: "newest" }),
  });

  const goToCourse = (courseId: string) => router.push(`/my-courses/${courseId}`);
  const goToCourseDetails = (courseId: string) => router.push(`/courses/${courseId}`);

  const recommendationsData = (browsed?.courses ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    duration: `${c.totalLessons} ${c.totalLessons === 1 ? "lesson" : "lessons"}`,
    category: c.category ?? "General",
  }));

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-400">Learning Hub</p>
          <h1 className="text-3xl font-semibold text-white">My Courses</h1>
          <p className="text-sm text-white/40">
            Continue your learning journey
          </p>
        </div>
        <button
          onClick={() => router.push("/my-courses/certificates")}
          className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10 transition"
        >
          <Award size={15} />
          My Certificates
        </button>
      </header>

      {/* Enrolled courses */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-white">Your Courses</h2>

        {isLoading && (
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Loader2 size={15} className="animate-spin" />
            Loading your courses…
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle size={15} />
            Failed to load your courses.
          </div>
        )}

        {!isLoading && !error && enrolled?.length === 0 && (
          <div className="rounded-xl border border-white/8 bg-white/4 p-8 text-center">
            <BookOpen size={32} className="mx-auto mb-3 text-white/20" />
            <p className="text-sm text-white/50">No courses yet. Browse and purchase a course to get started.</p>
            <button
              onClick={() => router.push("/courses")}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Browse Courses
            </button>
          </div>
        )}

        {!isLoading && enrolled && enrolled.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enrolled.map((course) => (
              <button
                key={course.id}
                onClick={() => goToCourse(course.id)}
                className="group overflow-hidden rounded-xl border border-white/8 bg-white/4 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
              >
                <div className="relative aspect-video overflow-hidden bg-black/40">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white/5">
                      <BookOpen size={28} className="text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <Play size={24} fill="white" className="drop-shadow-lg" />
                  </div>
                  {course.progressPercent > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  {course.category && (
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider text-blue-300">{course.category}</p>
                  )}
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-white">{course.title}</p>
                  <p className="mt-1.5 text-[0.68rem] text-white/40">
                    {course.totalLessons} {course.totalLessons === 1 ? "lesson" : "lessons"}
                    {course.progressPercent > 0 && ` · ${course.progressPercent}% complete`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {recommendationsData.length > 0 && (
        <Recommendations
          title="Recommended For You"
          subtitle="Based on your learning history"
          courses={recommendationsData}
          onCourseClick={goToCourseDetails}
        />
      )}
    </div>
  );
}

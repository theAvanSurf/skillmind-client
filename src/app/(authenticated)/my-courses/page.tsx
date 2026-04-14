'use client'
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import CoursePromo from "@/features/dashboard/components/course-promo";
import Recommendations from "@/features/dashboard/components/recommendations";
import { browseCourses } from "@/features/courses/services/browse-courses.service";

export default function MyCoursesPage() {
  const router = useRouter();

  const { data: browsed } = useQuery({
    queryKey: ["courses", "browse", "my-courses"],
    queryFn: () => browseCourses({ pageSize: 6, sort: "newest" }),
  });

  const goToCourseDetails = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

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
            Continue your learning journey with personalized recommendations
          </p>
        </div>
      </header>

      <CoursePromo
        title="Special Offer: Advanced Learning Bundle"
        description="Get 40% off all premium courses this week. Upgrade your skills with expert-led courses on React, Node.js, and more."
        primaryAction={{
          text: "View Offer",
          href: "/offers/advanced-learning",
        }}
        secondaryAction={{
          text: "Learn More",
          href: "/offers",
        }}
        accentColor="purple"
        showBadge={true}
        badgeText="Limited Time"
      />

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

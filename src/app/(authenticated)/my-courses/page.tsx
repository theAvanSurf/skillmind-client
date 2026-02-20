'use client'
import CoursePromo from "@/features/dashboard/components/course-promo";
import ContinueLearning from "@/features/dashboard/components/continue-learning";
import Recommendations from "@/features/dashboard/components/recommendations";
import Favorites from "@/features/dashboard/components/favorites";

const continueData = [
  { id: 1, title: "Advanced React Patterns", duration: "45 mins" },
  { id: 2, title: "TypeScript Essentials", duration: "30 mins" },
  { id: 3, title: "Web Performance Optimization", duration: "1 hour" },
];

const recommendationsData = [
  { id: 1, title: "Next.js Full Stack Development", duration: "15 hours", category: "Frontend" },
  { id: 2, title: "GraphQL for Beginners", duration: "12 hours", category: "Backend" },
  { id: 3, title: "UI/UX Design Principles", duration: "10 hours", category: "Design" },
];

const favoritesData = [
  { id: 1, title: "Building Scalable APIs", instructor: "John Smith", duration: "20 hours", isFavorite: true },
  { id: 2, title: "Mobile App Development", instructor: "Sarah Johnson", duration: "25 hours", isFavorite: true },
  { id: 3, title: "Cloud Computing Fundamentals", instructor: "Mike Chen", duration: "18 hours", isFavorite: true },
];

export default function MyCoursesPage() {
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

      <ContinueLearning
        title="Continue Learning"
        subtitle="Finish what you started"
        courses={continueData}
      />

      <Recommendations
        title="Recommended For You"
        subtitle="Based on your learning history"
        courses={recommendationsData}
      />

      <Favorites
        title="Your Favorite Courses"
        favorites={favoritesData}
      />
    </div>
  );
}

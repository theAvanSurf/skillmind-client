import CoursePromo from "@/src/components/shared/course-promo";
import CourseCard from "@/src/components/shared/course-card";
import ContinueLearning from "@/src/components/shared/continue-learning";
import Recommendations from "@/src/components/shared/recommendations";
import Favorites from "@/src/components/shared/favorites";

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

const allCoursesData = [
  {
    title: "React Advanced Hooks",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    progress: 75,
    duration: "14h 20m",
    lessons: 34,
    category: "Frontend",
  },
  {
    title: "Node.js Microservices",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    progress: 45,
    duration: "18h 50m",
    lessons: 42,
    category: "Backend",
  },
  {
    title: "Tailwind CSS Mastery",
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80",
    progress: 88,
    duration: "10h 15m",
    lessons: 25,
    category: "Frontend",
  },
  {
    title: "Docker & Kubernetes",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f70d504d0?auto=format&fit=crop&w=1200&q=80",
    progress: 32,
    duration: "22h 40m",
    lessons: 48,
    category: "DevOps",
  },
];

export default function MyCoursesPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-orange-600">Learning Hub</p>
          <h1 className="text-3xl font-semibold text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-600">
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

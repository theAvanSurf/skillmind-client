import { becauseYouWatched, continueWatching, personalRecommendations } from "@/features/home/mock-data";
import { completedCourses, inProgressCourses } from "@/app/(authenticated)/dashboard/mock-data";

export type CourseCatalogItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category?: string;
  image: string;
  progress: number;
  seasonName?: string;
  chapterName?: string;
  episodeNumber?: number;
  videoUrl: string;
};

const CLOUDINARY_HLS =
  "https://res.cloudinary.com/dgsfeis7x/video/upload/sp_auto/v1769999430/uploads/yfhx58pwpsoywx7lcrzf.m3u8";

const fromDashboard: CourseCatalogItem[] = [
  ...inProgressCourses,
  ...completedCourses,
].map((course, index) => ({
  id: course.id,
  title: course.title,
  description: `${course.title} course journey with guided lessons and hands-on practice.`,
  duration: course.duration,
  category: course.category,
  image: course.image,
  progress: course.progress,
  seasonName: "Skillmind Learning Track",
  chapterName: course.category ?? "Core",
  episodeNumber: index + 1,
  videoUrl: CLOUDINARY_HLS,
}));

const fromContinueWatching: CourseCatalogItem[] = continueWatching.map((course, index) => ({
  id: course.id,
  title: course.title,
  description: `Continue learning ${course.title} from ${course.currentLesson}.`,
  duration: course.duration,
  category: course.category,
  image: course.image,
  progress: course.progress,
  seasonName: "Continue Watching",
  chapterName: course.currentLesson,
  episodeNumber: index + 1,
  videoUrl: CLOUDINARY_HLS,
}));

const fromBecauseYouWatched: CourseCatalogItem[] = becauseYouWatched.recommendations.map((course, index) => ({
  id: course.id,
  title: course.title,
  description: `Recommended because you watched ${becauseYouWatched.sourceCourse}.`,
  duration: "45 mins",
  category: course.category,
  image: course.image,
  progress: 0,
  seasonName: "Recommended Path",
  chapterName: course.category,
  episodeNumber: index + 1,
  videoUrl: CLOUDINARY_HLS,
}));

const fromPersonalRecommendations: CourseCatalogItem[] = personalRecommendations.map((course, index) => ({
  id: course.id,
  title: course.title,
  description: `Personalized recommendation in ${course.category}.`,
  duration: course.duration,
  category: course.category,
  image: course.image,
  progress: 0,
  seasonName: "Personal Recommendations",
  chapterName: course.category,
  episodeNumber: index + 1,
  videoUrl: CLOUDINARY_HLS,
}));

const deduped = new Map<string, CourseCatalogItem>();
[
  ...fromDashboard,
  ...fromContinueWatching,
  ...fromBecauseYouWatched,
  ...fromPersonalRecommendations,
].forEach((course) => {
  if (!deduped.has(course.id)) {
    deduped.set(course.id, course);
  }
});

export const courseCatalog: CourseCatalogItem[] = Array.from(deduped.values());

export function getCourseById(courseId: string): CourseCatalogItem | undefined {
  return courseCatalog.find((course) => course.id === courseId);
}

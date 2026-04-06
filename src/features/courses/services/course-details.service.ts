import { courseCatalog, getCourseById, type CourseCatalogItem } from "@/features/courses/data/course-catalog";

export type CourseLesson = {
  id: string;
  title: string;
  duration: string;
  kind: "lesson" | "exercise";
};

export type CourseSeason = {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
};

export type CourseDetailsModel = CourseCatalogItem & {
  seasons: CourseSeason[];
  relatedCourses: CourseCatalogItem[];
};

type FetchCourseDetailsOptions = {
  simulateFailure?: boolean;
};

function buildDefaultSeasons(course: CourseCatalogItem): CourseSeason[] {
  const topic = course.category ?? "Core Skills";

  return [
    {
      id: "s1",
      title: "Season 1 - The Basics",
      description: `Foundations and onboarding for ${topic}.`,
      lessons: [
        { id: `${course.id}-s1-l1`, title: `Welcome to ${course.title}`, duration: "8 mins", kind: "lesson" },
        { id: `${course.id}-s1-l2`, title: `${topic} Core Concepts`, duration: "14 mins", kind: "lesson" },
        { id: `${course.id}-s1-l3`, title: "Practice Checkpoint", duration: "11 mins", kind: "exercise" },
      ],
    },
    {
      id: "s2",
      title: `Season 2 - Introduction to ${topic}`,
      description: `Hands-on workflows and practical scenarios for ${topic}.`,
      lessons: [
        { id: `${course.id}-s2-l1`, title: "Real-World Walkthrough", duration: "18 mins", kind: "lesson" },
        { id: `${course.id}-s2-l2`, title: "Guided Lab", duration: "22 mins", kind: "exercise" },
        { id: `${course.id}-s2-l3`, title: "Common Pitfalls", duration: "12 mins", kind: "lesson" },
      ],
    },
    {
      id: "s3",
      title: "Season 3 - Advanced Concepts",
      description: "Optimization, scaling, and production-level best practices.",
      lessons: [
        { id: `${course.id}-s3-l1`, title: "Architecture Patterns", duration: "25 mins", kind: "lesson" },
        { id: `${course.id}-s3-l2`, title: "Performance & Quality", duration: "20 mins", kind: "lesson" },
        { id: `${course.id}-s3-l3`, title: "Capstone Challenge", duration: "30 mins", kind: "exercise" },
      ],
    },
  ];
}

function buildRelatedCourses(source: CourseCatalogItem, max = 15): CourseCatalogItem[] {
  const sameCategory = courseCatalog.filter(
    (course) => course.id !== source.id && course.category === source.category
  );
  const rest = courseCatalog.filter(
    (course) => course.id !== source.id && course.category !== source.category
  );

  return [...sameCategory, ...rest].slice(0, max);
}

export function resolveSeason(seasons: CourseSeason[], selectedSeasonId: string | null): CourseSeason {
  const fallback = seasons[0];
  if (!fallback) {
    return { id: "empty", title: "Season", description: "No lessons available.", lessons: [] };
  }

  if (!selectedSeasonId) return fallback;
  return seasons.find((season) => season.id === selectedSeasonId) ?? fallback;
}

export type NextLessonInfo = {
  lessonId: string;
  seasonId: string;
  lesson: CourseLesson;
  season: CourseSeason;
};

export function getNextLesson(
  seasons: CourseSeason[],
  currentSeasonId: string,
  currentLessonId: string
): NextLessonInfo | null {
  const currentSeasonIndex = seasons.findIndex((s) => s.id === currentSeasonId);
  if (currentSeasonIndex === -1) return null;

  const currentSeason = seasons[currentSeasonIndex];
  const currentLessonIndex = currentSeason.lessons.findIndex((l) => l.id === currentLessonId);

  // Next lesson in current season
  if (currentLessonIndex < currentSeason.lessons.length - 1) {
    const nextLesson = currentSeason.lessons[currentLessonIndex + 1];
    return {
      lessonId: nextLesson.id,
      seasonId: currentSeasonId,
      lesson: nextLesson,
      season: currentSeason,
    };
  }

  // Next season's first lesson
  if (currentSeasonIndex < seasons.length - 1) {
    const nextSeason = seasons[currentSeasonIndex + 1];
    if (nextSeason.lessons.length > 0) {
      const nextLesson = nextSeason.lessons[0];
      return {
        lessonId: nextLesson.id,
        seasonId: nextSeason.id,
        lesson: nextLesson,
        season: nextSeason,
      };
    }
  }

  return null;
}

export function getPreviousLesson(
  seasons: CourseSeason[],
  currentSeasonId: string,
  currentLessonId: string
): NextLessonInfo | null {
  const currentSeasonIndex = seasons.findIndex((s) => s.id === currentSeasonId);
  if (currentSeasonIndex === -1) return null;

  const currentSeason = seasons[currentSeasonIndex];
  const currentLessonIndex = currentSeason.lessons.findIndex((l) => l.id === currentLessonId);

  // Previous lesson in current season
  if (currentLessonIndex > 0) {
    const prevLesson = currentSeason.lessons[currentLessonIndex - 1];
    return {
      lessonId: prevLesson.id,
      seasonId: currentSeasonId,
      lesson: prevLesson,
      season: currentSeason,
    };
  }

  // Previous season's last lesson
  if (currentSeasonIndex > 0) {
    const prevSeason = seasons[currentSeasonIndex - 1];
    if (prevSeason.lessons.length > 0) {
      const prevLesson = prevSeason.lessons[prevSeason.lessons.length - 1];
      return {
        lessonId: prevLesson.id,
        seasonId: prevSeason.id,
        lesson: prevLesson,
        season: prevSeason,
      };
    }
  }

  return null;
}

export async function fetchCourseDetails(
  courseId: string,
  options: FetchCourseDetailsOptions = {}
): Promise<CourseDetailsModel | null> {
  if (options.simulateFailure) {
    throw new Error("Unable to load course. Please try again.");
  }

  const course = getCourseById(courseId);
  if (!course) return null;

  const seasons = buildDefaultSeasons(course);
  const relatedCourses = buildRelatedCourses(course, 15);

  return {
    ...course,
    seasons,
    relatedCourses,
  };
}

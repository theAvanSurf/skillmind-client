import { httpClientBrowser } from "@/configurations/httpClientBrowser";

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

export type CourseDetailsModel = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category?: string;
  tags?: string;
  image: string;
  progress: number;
  videoUrl: string;
  seasons: CourseSeason[];
  relatedCourses: any[];
};

type FetchCourseDetailsOptions = {
  simulateFailure?: boolean;
};

export function resolveSeason(seasons: CourseSeason[], selectedSeasonId: string | null): CourseSeason {
  const fallback = seasons[0];
  if (!fallback) {
    return { id: "empty", title: "Season", description: "This course has no seasons or lessons published yet.", lessons: [] };
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

  try {
    const course = await httpClientBrowser.get(`/courses/${courseId}`) as any;
    
    const mappedSeasons: CourseSeason[] = (course.seasons || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description || `${s.title} overview`,
      lessons: (s.lessons || []).map((l: any) => ({
        id: l.id,
        title: l.title,
        duration: Math.ceil((l.durationSeconds || 0) / 60) + " mins",
        kind: "lesson"
      }))
    }));

    try {
        const relatedRes = await httpClientBrowser.get(`/courses/${courseId}/related`) as any[];
        const mappedRelated = (relatedRes || []).map((rc: any) => ({
            id: rc.id,
            title: rc.title,
            description: rc.description || "",
            duration: "N/A",
            category: rc.category,
            image: rc.thumbnailUrl,
            progress: rc.progressPercent || 0,
            videoUrl: ""
        }));
        
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          duration: mappedSeasons.length > 0 ? `${mappedSeasons.length} seasons` : `0 seasons`,
          category: course.category,
          tags: course.tags,
          image: course.thumbnailUrl,
          progress: 0,
          videoUrl: "",
          seasons: mappedSeasons,
          relatedCourses: mappedRelated,
        };
    } catch {
        return {
          id: course.id,
          title: course.title,
          description: course.description,
          duration: mappedSeasons.length > 0 ? `${mappedSeasons.length} seasons` : `0 seasons`,
          category: course.category,
          tags: course.tags,
          image: course.thumbnailUrl,
          progress: 0,
          videoUrl: "",
          seasons: mappedSeasons,
          relatedCourses: [],
        };
    }

  } catch (err) {
    return null;
  }
}

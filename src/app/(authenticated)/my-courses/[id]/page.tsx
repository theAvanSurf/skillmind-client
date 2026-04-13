"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { VideoPlayer } from "@/shared/video-player/VideoPlayer";
import {
  fetchCourseDetails,
  getNextLesson,
  getPreviousLesson,
  type CourseDetailsModel,
} from "@/features/courses/services/course-details.service";

export default function CoursePlayerPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;

  const [courseDetails, setCourseDetails] = useState<CourseDetailsModel | null>(null);
  const [seasonId, setSeasonId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectedSeason = useMemo(() => {
    if (!courseDetails || !seasonId) return null;
    return courseDetails.seasons.find((s) => s.id === seasonId);
  }, [courseDetails, seasonId]);

  const selectedLesson = useMemo(() => {
    if (!selectedSeason || !lessonId) return null;
    return selectedSeason.lessons.find((l) => l.id === lessonId);
  }, [selectedSeason, lessonId]);


  const nextChapter = useMemo(() => {
    if (!courseDetails || !seasonId || !lessonId) return null;
    return getNextLesson(courseDetails.seasons, seasonId, lessonId);
  }, [courseDetails, seasonId, lessonId]);

  const previousChapter = useMemo(() => {
    if (!courseDetails || !seasonId || !lessonId) return null;
    return getPreviousLesson(courseDetails.seasons, seasonId, lessonId);
  }, [courseDetails, seasonId, lessonId]);

  // Load course details and set initial season/lesson
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const details = await fetchCourseDetails(id);
        if (details) {
          setCourseDetails(details);

          // Get season and lesson from query params or use defaults
          const paramSeason = searchParams.get("season");
          const paramLesson = searchParams.get("lesson");

          const season = paramSeason || details.seasons[0]?.id;
          setSeasonId(season ?? null);

          if (paramLesson) {
            setLessonId(paramLesson);
          } else {
            const firstLesson = details.seasons
              .find((s) => s.id === season)?.lessons[0];
            setLessonId(firstLesson?.id ?? null);
          }
        }
      } catch {
        // Fallback if service fails
      } finally {
        setIsLoading(false);
      }
    };

    void loadCourse();
  }, [id, searchParams]);

  const handleAutoPlayNext = useCallback(() => {
    if (nextChapter) {
      router.push(`/my-courses/${id}?season=${nextChapter.seasonId}&lesson=${nextChapter.lessonId}`);
    }
  }, [nextChapter, id, router]);

  const handlePlayNext = useCallback(() => {
    if (nextChapter) {
      router.push(`/my-courses/${id}?season=${nextChapter.seasonId}&lesson=${nextChapter.lessonId}`);
    }
  }, [nextChapter, id, router]);

  const handlePlayPrevious = useCallback(() => {
    if (previousChapter) {
      router.push(`/my-courses/${id}?season=${previousChapter.seasonId}&lesson=${previousChapter.lessonId}`);
    }
  }, [previousChapter, id, router]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-96 bg-white/8 animate-pulse rounded-lg" />
        <div className="h-8 bg-white/8 animate-pulse rounded w-1/2" />
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="p-6 text-white">
        <h2 className="text-xl">Course not found</h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* VIDEO PLAYER */}
      <div className="space-y-4">
        <VideoPlayer
          videoUrl={selectedLesson?.videoUrl || courseDetails.videoUrl || ""}
          title={selectedLesson?.title || courseDetails.title}
          description={courseDetails.description}
          seasonName={selectedSeason?.title}
          chapterName={selectedLesson?.title}
          episodeNumber={selectedLesson ? 1 : undefined}
          storageKey={`course-${courseDetails.id}`}
          onProgressUpdate={(progress, time) => {
            try {
              localStorage.setItem(`course-progress:${courseDetails.id}`, String(progress));
              localStorage.setItem(`course-last-time:${courseDetails.id}`, String(time));
            } catch {
              // Ignore storage write failures
            }
          }}
          onEnded={nextChapter ? handleAutoPlayNext : undefined}
        />

        {/* CHAPTER NAVIGATION */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePlayPrevious}
            disabled={!previousChapter}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/18"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {nextChapter && (
            <button
              onClick={handlePlayNext}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* COURSE INFO */}
      <div className="text-white space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{courseDetails.title}</h1>
          {selectedSeason && (
            <p className="text-base font-semibold text-blue-300">{selectedSeason.title}</p>
          )}
          {selectedLesson && (
            <p className="text-sm text-white/70">{selectedLesson.title}</p>
          )}
        </div>

        <p className="text-white/70">{courseDetails.description}</p>

        {courseDetails && (
          <div className="space-y-6 border-t border-white/10 pt-6">
            {/* SEASONS */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Seasons</h2>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {courseDetails.seasons.map((season, seasonIndex) => {
                  const isSelectedSeason = season.id === seasonId;
                  return (
                    <div
                      key={season.id}
                      className={`rounded-lg border p-4 transition cursor-pointer ${
                        isSelectedSeason
                          ? "border-blue-400 bg-blue-500/15"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <p className="font-semibold text-white">{season.title}</p>
                      <p className="text-xs text-white/60 mt-1">{season.lessons.length} lessons</p>
                      {isSelectedSeason && (
                        <div className="mt-3 space-y-2">
                          {season.lessons.map((lesson, lessonIndex) => {
                            const isSelected = lesson.id === lessonId;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  setSeasonId(season.id);
                                  setLessonId(lesson.id);
                                  router.push(
                                    `/my-courses/${id}?season=${season.id}&lesson=${lesson.id}`
                                  );
                                }}
                                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                                  isSelected
                                    ? "bg-blue-500 text-white font-semibold"
                                    : "bg-white/10 text-white/80 hover:bg-white/18"
                                }`}
                              >
                                {lessonIndex + 1}. {lesson.title}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
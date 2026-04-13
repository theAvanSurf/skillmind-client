"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Play, Clock3, Layers3, AlertTriangle } from "lucide-react";
import {
  fetchCourseDetails,
  resolveSeason,
  type CourseDetailsModel,
} from "@/features/courses/services/course-details.service";
import { resolveStoredProgress } from "@/features/courses/utils/course-progress";

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const relatedRef = useRef<HTMLElement | null>(null);

  const [course, setCourse] = useState<CourseDetailsModel | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [savedProgressPct, setSavedProgressPct] = useState(0);
  const [savedTimestamp, setSavedTimestamp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCourseDetails(id, {
        simulateFailure: searchParams.get("fail") === "1",
      });

      if (!data) {
        setCourse(null);
        setSelectedSeasonId(null);
        setSavedProgressPct(0);
        setSavedTimestamp(null);
        return;
      }

      setCourse(data);
      setSelectedSeasonId((current) => current ?? data.seasons[0]?.id ?? null);
      const progress = resolveStoredProgress(data.id, data.progress, data.duration);
      setSavedProgressPct(progress.effectiveProgress);
      setSavedTimestamp(progress.storedTimestamp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [id, searchParams]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  const selectedSeason = useMemo(() => {
    if (!course) return null;
    return resolveSeason(course.seasons, selectedSeasonId);
  }, [course, selectedSeasonId]);

  const handlePlay = useCallback(() => {
    if (!course || !selectedSeason) return;
    const firstLesson = selectedSeason.lessons[0];
    if (firstLesson) {
      router.push(`/my-courses/${course.id}?season=${selectedSeason.id}&lesson=${firstLesson.id}`);
    } else {
      router.push(`/my-courses/${course.id}`);
    }
  }, [course, selectedSeason, router]);

  const handleScrollToRelated = useCallback(() => {
    relatedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSelectSeason = useCallback((seasonId: string) => {
    setSelectedSeasonId(seasonId);
  }, []);

  const handlePlayLesson = useCallback(
    (lessonId: string, seasonId: string) => {
      if (!course) return;
      router.push(`/my-courses/${course.id}?season=${seasonId}&lesson=${lessonId}`);
    },
    [course, router]
  );

  const handleOpenRelatedCourse = useCallback(
    (courseId: string) => {
      router.push(`/courses/${courseId}`);
    },
    [router]
  );

  const effectiveProgress = useMemo(() => {
    if (!course) return 0;
    return Math.max(course.progress, savedProgressPct);
  }, [course, savedProgressPct]);

  const isInProgress = effectiveProgress > 0 && effectiveProgress < 100;

  const resumeLabel =
    savedTimestamp != null && savedTimestamp > 0
      ? `Resume from ${Math.floor(savedTimestamp / 60)}:${String(
          Math.floor(savedTimestamp % 60)
        ).padStart(2, "0")}`
      : null;

  if (isLoading) {
    return (
      <div className="space-y-5 p-5 text-white sm:p-8">
        <div className="h-70 animate-pulse rounded-2xl bg-white/8" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-white/8" />
        <div className="h-30 animate-pulse rounded-xl bg-white/6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-white">
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-6">
          <div className="flex items-center gap-3 text-red-300">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Unable to load course</h2>
          </div>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
          <button
            onClick={() => void loadCourse()}
            className="mt-4 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!course || !selectedSeason) {
    return (
      <div className="p-6 text-white">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <p className="mt-2 text-sm text-white/60">
          This course does not exist or is no longe
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10 text-white sm:space-y-9 sm:pb-14">
      <section className="relative overflow-hidden bg-black">
        <img
          src={course.image}
          alt={course.title}
          className="h-74 w-full object-cover sm:h-112"
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/90">
            {course.category ?? "Course"}
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {course.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">{course.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlay}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white/90"
            >
              <Play className="h-4 w-4 fill-black" />
              {isInProgress ? "Resume" : "Play"}
            </button>
            <button
              onClick={handleScrollToRelated}
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/18"
            >
              Related Courses
            </button>
          </div>

          {effectiveProgress > 0 && (
            <div className="mt-4 max-w-sm space-y-1.5">
              <div className="flex items-center justify-between text-xs text-white/75">
                <span>Progress</span>
                <span>{Math.round(effectiveProgress)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-linear-to-r from-blue-400 to-sky-300"
                  style={{ width: `${effectiveProgress}%` }}
                />
              </div>
              {resumeLabel && <p className="text-xs text-white/60">{resumeLabel}</p>}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Seasons</h2>

          <select
            className="rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white sm:hidden"
            value={selectedSeason.id}
            onChange={(e) => handleSelectSeason(e.target.value)}
            aria-label="Select season"
          >
            {course.seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
          {course.seasons.map((season) => {
            const active = season.id === selectedSeason.id;
            return (
              <button
                key={season.id}
                onClick={() => handleSelectSeason(season.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-black"
                    : "border border-white/15 bg-white/8 text-white hover:bg-white/16"
                }`}
              >
                {season.title}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-white/70">{selectedSeason.description}</p>

          <div className="mt-4 space-y-2.5">
            {selectedSeason.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => handlePlayLesson(lesson.id, selectedSeason.id)}
                className="w-full text-left flex items-center justify-between rounded-lg border border-white/10 bg-white/4 p-3 transition hover:bg-white/12 hover:border-white/20"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {index + 1}. {lesson.title}
                  </p>
                  <p className="mt-0.5 text-xs text-white/55">
                    {lesson.kind === "exercise" ? "Exercise" : "Lesson"}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-1.5 text-xs text-white/55">
                  <Clock3 className="h-3.5 w-3.5" />
                  {lesson.duration}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section ref={relatedRef} className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-blue-300" />
          <h2 className="text-lg font-semibold sm:text-xl">Related Courses</h2>
        </div>

        {course.relatedCourses.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/4 p-4 text-sm text-white/70">
            No related courses available right now.
          </div>
        ) : (
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {course.relatedCourses.slice(0, 15).map((relatedCourse) => (
              <button
                key={relatedCourse.id}
                onClick={() => handleOpenRelatedCourse(relatedCourse.id)}
                className="group w-58 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition hover:-translate-y-0.5 hover:border-white/20"
              >
                <img
                  src={relatedCourse.image}
                  alt={relatedCourse.title}
                  className="h-32 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-white">{relatedCourse.title}</p>
                  {relatedCourse.progress > 0 && (
                    <>
                      <p className="mt-2 text-xs text-blue-300">Continue Watching</p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                        <div
                          className="h-full bg-linear-to-r from-blue-400 to-sky-300"
                          style={{ width: `${Math.min(100, relatedCourse.progress)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

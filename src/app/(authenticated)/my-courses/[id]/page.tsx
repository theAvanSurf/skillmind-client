"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft, Radio } from "lucide-react";
import { VideoPlayer } from "@/shared/video-player/VideoPlayer";
import {
  fetchCourseDetails,
  getNextLesson,
  getPreviousLesson,
  type CourseDetailsModel,
} from "@/features/courses/services/course-details.service";

interface LiveSession {
  id: string
  title: string
  embedUrl: string | null
  youTubeBroadcastId: string | null
  status: string
  scheduledAt: string | null
}

function LiveTab({ courseId }: { courseId: string }) {
  const [session, setSession] = useState<LiveSession | null | undefined>(undefined)

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/live`)
        const data = await res.json()
        setSession(data)
      } catch {
        setSession(null)
      }
    }
    fetchLive()
    const interval = setInterval(fetchLive, 30_000)
    return () => clearInterval(interval)
  }, [courseId])

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-red-400 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
        <Radio size={36} className="mx-auto mb-3 text-white/20" />
        <p className="text-sm font-semibold text-white/50">No live session right now</p>
        <p className="mt-1 text-xs text-white/25">Check back when your professor goes live</p>
      </div>
    )
  }

  const videoId = session.youTubeBroadcastId

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> LIVE
        </span>
        <p className="text-sm font-semibold text-white">{session.title}</p>
      </div>

      {videoId ? (
        <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={session.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-sm text-white/50">Stream starting soon...</p>
        </div>
      )}
    </div>
  )
}

export default function CoursePlayerPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;

  const [courseDetails, setCourseDetails] = useState<CourseDetailsModel | null>(null);
  const [seasonId, setSeasonId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lessons" | "live">("lessons");

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

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const details = await fetchCourseDetails(id);
        if (details) {
          setCourseDetails(details);
          const paramSeason = searchParams.get("season");
          const paramLesson = searchParams.get("lesson");
          const season = paramSeason || details.seasons[0]?.id;
          setSeasonId(season ?? null);
          if (paramLesson) {
            setLessonId(paramLesson);
          } else {
            const firstLesson = details.seasons.find((s) => s.id === season)?.lessons[0];
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
      {/* TABS */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-0">
        <button
          onClick={() => setActiveTab("lessons")}
          className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === "lessons"
              ? "border-blue-400 text-white"
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          Lessons
        </button>
        <button
          onClick={() => setActiveTab("live")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === "live"
              ? "border-red-400 text-white"
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          <Radio size={13} />
          Live
        </button>
      </div>

      {/* LIVE TAB */}
      {activeTab === "live" && <LiveTab courseId={id} />}

      {/* LESSONS TAB */}
      {activeTab === "lessons" && (
        <>
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
                <div>
                  <h2 className="text-lg font-semibold mb-4">Seasons</h2>
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {courseDetails.seasons.map((season) => {
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
        </>
      )}
    </div>
  );
}

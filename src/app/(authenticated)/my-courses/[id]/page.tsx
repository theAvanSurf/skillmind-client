"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft, Radio, Lock, ClipboardList, Clock, Trophy } from "lucide-react";
import { VideoPlayer } from "@/shared/video-player/VideoPlayer";
import {
  fetchCourseDetails,
  getNextLesson,
  getPreviousLesson,
  getEnrollmentStatus,
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

interface ExamSummary {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  passingScore: number;
  questionCount: number;
  status: string;
}

function ExamsTab({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [exams, setExams] = useState<ExamSummary[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/exams`)
      .then((r) => r.json())
      .then((d) => setExams(Array.isArray(d) ? d : []))
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-blue-400 animate-spin" />
      </div>
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
        <ClipboardList size={36} className="mx-auto mb-3 text-white/20" />
        <p className="text-sm font-semibold text-white/50">No exams available</p>
        <p className="mt-1 text-xs text-white/25">Your professor hasn't published any exams yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exams.map((exam) => (
        <div key={exam.id} className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{exam.title}</p>
            {exam.description && <p className="mt-0.5 text-xs text-white/50 line-clamp-2">{exam.description}</p>}
            <div className="mt-2 flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1"><Clock size={11} />{exam.durationMinutes} min</span>
              <span className="flex items-center gap-1"><ClipboardList size={11} />{exam.questionCount} questions</span>
              <span className="flex items-center gap-1"><Trophy size={11} />Pass: {exam.passingScore}pts</span>
            </div>
          </div>
          <button
            onClick={() => router.push(`/my-courses/${courseId}/exam/${exam.id}`)}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Take Exam
          </button>
        </div>
      ))}
    </div>
  );
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
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<"lessons" | "live" | "exams">("lessons");
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // startTime comes from backend; only valid for the lesson that was last saved
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const lastProgressLessonIdRef = useRef<string | null>(null);
  // tracks current progress % without localStorage
  const progressPctRef = useRef(0);

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
        // Guard: check enrollment before loading player
        const enrollment = await getEnrollmentStatus(id).catch(() => null);
        if (enrollment && enrollment.purchaseRequired && !enrollment.isEnrolled) {
          setAccessDenied(true);
          setIsLoading(false);
          return;
        }

        const [details, progressResp] = await Promise.all([
          fetchCourseDetails(id),
          fetch(`/api/courses/${id}/progress`).then(r => r.json()).catch(() => null),
        ]);

        if (details) {
          setCourseDetails(details);
          const paramSeason = searchParams.get("season");
          const paramLesson = searchParams.get("lesson");

          // Determine which lesson to start
          let targetLessonId: string | null = null;
          let targetSeasonId: string | null = null;

          if (paramLesson && paramSeason) {
            targetLessonId = paramLesson;
            targetSeasonId = paramSeason;
          } else if (progressResp?.lastLessonId) {
            // Resume from backend — find season for this lesson
            for (const season of details.seasons) {
              const lesson = season.lessons.find(l => l.id === progressResp.lastLessonId);
              if (lesson) {
                targetLessonId = lesson.id;
                targetSeasonId = season.id;
                break;
              }
            }
          }

          if (!targetLessonId) {
            const season = paramSeason || details.seasons[0]?.id;
            targetSeasonId = season ?? null;
            const firstLesson = details.seasons.find(s => s.id === season)?.lessons[0];
            targetLessonId = firstLesson?.id ?? null;
          }

          setSeasonId(targetSeasonId);
          setLessonId(targetLessonId);

          // Store backend timestamp so VideoPlayer can seek to resume position
          if (progressResp?.lastLessonId && progressResp?.lastTimestampSeconds > 0) {
            lastProgressLessonIdRef.current = progressResp.lastLessonId;
            setStartTime(progressResp.lastTimestampSeconds);
          }
        }
      } catch {
        // Fallback if service fails
      } finally {
        setIsLoading(false);
      }
    };
    void loadCourse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only re-fetch when the course changes, not on every lesson switch

  // Fire immediately when a lesson becomes active — creates the DB record right away
  // so it shows in Watch History even if user leaves before the debounce fires.
  useEffect(() => {
    if (!lessonId || !courseDetails) return;
    const resumeTime = lessonId === lastProgressLessonIdRef.current
      ? (startTime ?? 0)
      : 0;
    fetch(`/api/courses/${courseDetails.id}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progressPercent: Math.round(progressPctRef.current),
        lastLessonId: lessonId,
        lastTimestampSeconds: resumeTime,
      }),
    })
      .then(() => window.dispatchEvent(new Event("skillmind:progress-updated")))
      .catch(() => {});
  }, [lessonId, courseDetails?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateToLesson = useCallback((seasonId: string, lessonId: string) => {
    setSeasonId(seasonId);
    setLessonId(lessonId);
    router.replace(`/my-courses/${id}?season=${seasonId}&lesson=${lessonId}`);
  }, [id, router]);

  const handleAutoPlayNext = useCallback(() => {
    if (nextChapter) navigateToLesson(nextChapter.seasonId, nextChapter.lessonId);
  }, [nextChapter, navigateToLesson]);

  const handlePlayNext = useCallback(() => {
    if (nextChapter) navigateToLesson(nextChapter.seasonId, nextChapter.lessonId);
  }, [nextChapter, navigateToLesson]);

  const handlePlayPrevious = useCallback(() => {
    if (previousChapter) navigateToLesson(previousChapter.seasonId, previousChapter.lessonId);
  }, [previousChapter, navigateToLesson]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-96 bg-white/8 animate-pulse rounded-lg" />
        <div className="h-8 bg-white/8 animate-pulse rounded w-1/2" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
        <div className="rounded-full bg-yellow-500/10 p-4">
          <Lock size={28} className="text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Purchase Required</h2>
        <p className="text-sm text-white/50 max-w-xs">You need to purchase this course to watch it.</p>
        <button
          onClick={() => router.push(`/courses/${id}`)}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          View Course
        </button>
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
        <button
          onClick={() => setActiveTab("exams")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === "exams"
              ? "border-purple-400 text-white"
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          <ClipboardList size={13} />
          Exams
        </button>
      </div>

      {/* LIVE TAB */}
      {activeTab === "live" && <LiveTab courseId={id} />}

      {/* EXAMS TAB */}
      {activeTab === "exams" && <ExamsTab courseId={id} />}

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
              startTime={lessonId === lastProgressLessonIdRef.current ? startTime : undefined}
              onProgressUpdate={(progress, time) => {
                progressPctRef.current = progress;
                // Debounce backend sync — fire at most once every 3s
                if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
                progressTimerRef.current = setTimeout(() => {
                  fetch(`/api/courses/${courseDetails.id}/progress`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      progressPercent: Math.round(progress),
                      lastLessonId: lessonId,
                      lastTimestampSeconds: time,
                    }),
                  })
                    .then(() => window.dispatchEvent(new Event("skillmind:progress-updated")))
                    .catch(() => {});
                }, 3_000);
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
                          onClick={() => {
                            if (!isSelectedSeason) {
                              const firstLesson = season.lessons[0];
                              if (firstLesson) navigateToLesson(season.id, firstLesson.id);
                              else setSeasonId(season.id);
                            }
                          }}
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
                                    onClick={(e) => { e.stopPropagation(); navigateToLesson(season.id, lesson.id); }}
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

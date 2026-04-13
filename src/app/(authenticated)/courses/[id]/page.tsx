"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Play, Plus, ChevronDown, AlertTriangle, Clock } from "lucide-react";
import {
  fetchCourseDetails,
  resolveSeason,
  type CourseDetailsModel,
  type CourseSeason,
} from "@/features/courses/services/course-details.service";
import { resolveStoredProgress } from "@/features/courses/utils/course-progress";

type Tab = "episodes" | "related" | "details";

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [course, setCourse] = useState<CourseDetailsModel | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [savedProgressPct, setSavedProgressPct] = useState(0);
  const [savedTimestamp, setSavedTimestamp] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("episodes");
  const [seasonOpen, setSeasonOpen] = useState(false);

  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCourseDetails(id, {
        simulateFailure: searchParams.get("fail") === "1",
      });
      if (!data) { setCourse(null); return; }
      setCourse(data);
      setSelectedSeasonId((cur) => cur ?? data.seasons[0]?.id ?? null);
      const p = resolveStoredProgress(data.id, data.progress, data.duration);
      setSavedProgressPct(p.effectiveProgress);
      setSavedTimestamp(p.storedTimestamp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load course.");
    } finally {
      setIsLoading(false);
    }
  }, [id, searchParams]);

  useEffect(() => { void loadCourse(); }, [loadCourse]);

  const selectedSeason = useMemo(() => {
    if (!course) return null;
    return resolveSeason(course.seasons, selectedSeasonId);
  }, [course, selectedSeasonId]);

  const effectiveProgress = useMemo(() =>
    course ? Math.max(course.progress, savedProgressPct) : 0,
    [course, savedProgressPct]);

  const isInProgress = effectiveProgress > 0 && effectiveProgress < 100;

  const resumeLabel = savedTimestamp != null && savedTimestamp > 0
    ? `Resume ${Math.floor(savedTimestamp / 60)}:${String(Math.floor(savedTimestamp % 60)).padStart(2, "0")}`
    : null;

  const handlePlay = useCallback(() => {
    if (!course || !selectedSeason) return;
    const first = selectedSeason.lessons[0];
    router.push(first
      ? `/my-courses/${course.id}?season=${selectedSeason.id}&lesson=${first.id}`
      : `/my-courses/${course.id}`);
  }, [course, selectedSeason, router]);

  const handlePlayLesson = useCallback((lessonId: string, seasonId: string) => {
    if (!course) return;
    router.push(`/my-courses/${course.id}?season=${seasonId}&lesson=${lessonId}`);
  }, [course, router]);

  // breakout shell — layout.tsx handles full-bleed, just fill the space
  const shell = "min-h-screen w-full bg-[#0e0e10] text-white";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={shell}>
        <div className="h-[min(60vw,520px)] w-full animate-pulse bg-white/8" />
        <div className="flex gap-3 px-8 pt-6">
          {[1,2,3].map(i => <div key={i} className="h-5 w-24 animate-pulse rounded bg-white/8" />)}
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={shell}>
        <div className="flex flex-col gap-3 p-10 text-red-400">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-bold text-white">Unable to load course</h2>
          <p className="text-sm text-white/55">{error}</p>
          <button
            onClick={() => void loadCourse()}
            className="mt-2 w-fit rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
          >Try again</button>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!course) {
    return (
      <div className={shell}>
        <div className="p-10">
          <h2 className="text-xl font-bold">Course not found</h2>
          <p className="mt-2 text-sm text-white/55">This course does not exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "episodes", label: "Episodes" },
    { key: "related", label: "Suggestions" },
    { key: "details", label: "Details" },
  ];

  return (
    <div className={shell}>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div className="relative h-[min(60vw,540px)] w-full overflow-hidden bg-black">
        <img
          src={course.image}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        {/* left gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0e0e10]/95 via-[#0e0e10]/50 to-transparent" />
        {/* bottom gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0e0e10] via-transparent to-transparent" />

        {/* content */}
        <div className="absolute inset-0 flex max-w-lg flex-col justify-end px-8 pb-10 lg:px-14">
          {course.category && (
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-blue-300">
              {course.category}
            </p>
          )}

          <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}>
            {course.title}
          </h1>

          {/* meta */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[0.75rem] text-white/60">
            {course.seasons.length > 0 && (
              <span>{course.seasons.length} {course.seasons.length === 1 ? "Season" : "Seasons"}</span>
            )}
            {course.tags && (
              <>
                <span className="text-white/30">•</span>
                <span>{String(course.tags).split(",").join(", ")}</span>
              </>
            )}
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/75">
            {course.description}
          </p>

          {/* progress bar */}
          {effectiveProgress > 0 && (
            <div className="mt-3 max-w-[260px]">
              <div className="h-[3px] overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-linear-to-r from-blue-400 to-violet-400 transition-all duration-500"
                  style={{ width: `${effectiveProgress}%` }}
                />
              </div>
              {resumeLabel && <p className="mt-1 text-[0.68rem] text-white/45">{resumeLabel}</p>}
            </div>
          )}

          {/* CTAs */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handlePlay}
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-white/88 active:scale-95"
            >
              <Play size={16} fill="black" />
              {isInProgress && resumeLabel ? resumeLabel : (isInProgress ? "Resume" : "Play")}
            </button>
            <button
              title="Add to list"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/50 bg-white/15 text-white transition hover:bg-white/25"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── TABS ────────────────────────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-white/10 px-8 lg:px-14">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 text-[0.75rem] font-bold uppercase tracking-widest transition-colors ${
              activeTab === key
                ? "border-b-2 border-white text-white"
                : "text-white/45 hover:text-white/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}
      <div className="px-8 py-6 lg:px-14">

        {/* EPISODES */}
        {activeTab === "episodes" && (
          <>
            {course.seasons.length === 0 ? (
              <p className="text-sm text-white/40">No seasons or episodes have been published yet.</p>
            ) : (
              <>
                {/* season selector */}
                {course.seasons.length > 1 && (
                  <div className="relative mb-5 inline-block">
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
                      onClick={() => setSeasonOpen((o) => !o)}
                    >
                      {selectedSeason?.title ?? "Select Season"}
                      <ChevronDown size={15} className={`transition-transform ${seasonOpen ? "rotate-180" : ""}`} />
                    </button>
                    {seasonOpen && (
                      <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-white/10 bg-[#1e1e24] shadow-2xl">
                        {course.seasons.map((s: CourseSeason) => (
                          <button
                            key={s.id}
                            onClick={() => { setSelectedSeasonId(s.id); setSeasonOpen(false); }}
                            className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/8 ${
                              s.id === selectedSeasonId ? "font-bold text-white" : "text-white/65"
                            }`}
                          >
                            {s.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* episode grid */}
                {selectedSeason && (
                  selectedSeason.lessons.length === 0 ? (
                    <p className="text-sm text-white/40">No episodes in this season yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {selectedSeason.lessons.map((lesson, i) => (
                        <button
                          key={lesson.id}
                          onClick={() => handlePlayLesson(lesson.id, selectedSeason.id)}
                          className="group overflow-hidden rounded-xl border border-white/8 bg-white/4 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/8"
                        >
                          <div className="relative aspect-video overflow-hidden bg-black/40">
                            <img
                              src={course.image}
                              alt={lesson.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                              <Play size={24} fill="white" className="drop-shadow-lg" />
                            </div>
                            <span className="absolute bottom-1.5 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[0.65rem] font-bold text-white/75">
                              {i + 1}
                            </span>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-semibold leading-snug text-white">{lesson.title}</p>
                            {lesson.duration && (
                              <span className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] text-white/40">
                                <Clock size={11} /> {lesson.duration}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </>
        )}

        {/* RELATED */}
        {activeTab === "related" && (
          course.relatedCourses.length === 0 ? (
            <p className="text-sm text-white/40">No suggestions available right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {course.relatedCourses.map((rc: any) => (
                <button
                  key={rc.id}
                  onClick={() => router.push(`/courses/${rc.id}`)}
                  className="group overflow-hidden rounded-xl border border-white/8 bg-white/4 text-left transition hover:-translate-y-1 hover:border-white/20"
                >
                  <img src={rc.image} alt={rc.title} className="aspect-video w-full object-cover" />
                  <div className="p-2.5">
                    {rc.category && (
                      <p className="text-[0.6rem] font-bold uppercase tracking-wider text-blue-300">{rc.category}</p>
                    )}
                    <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-white">{rc.title}</p>
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {/* DETAILS */}
        {activeTab === "details" && (
          <dl className="max-w-xl space-y-4">
            {[
              { label: "Category", val: course.category },
              { label: "Tags", val: course.tags ? String(course.tags).split(",").join(", ") : null },
              { label: "Seasons", val: course.seasons.length > 0 ? String(course.seasons.length) : null },
              { label: "Description", val: course.description },
            ].filter(r => r.val).map(({ label, val }) => (
              <div key={label} className="flex gap-6">
                <dt className="w-24 shrink-0 text-[0.7rem] font-bold uppercase tracking-widest text-white/40 pt-0.5">{label}</dt>
                <dd className="text-sm leading-relaxed text-white/80">{val}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

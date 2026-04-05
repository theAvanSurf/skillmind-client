"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState, useMemo, useCallback } from "react";
import { useCourse, useRelatedCourses } from "@/features/courses/hooks/useCourse";
import { LessonDto, SeasonDto } from "@/features/courses/types/course.types";
import Image from "next/image";

export default function CourseDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const relatedRef = useRef<HTMLDivElement>(null);
    const [activeSeason, setActiveSeason] = useState<string | null>(null);

    const { data: course, isLoading, error } = useCourse(id);
    const { data: related } = useRelatedCourses(id);

    const selectedSeason = useMemo<SeasonDto | undefined>(() => {
        if (!course?.seasons?.length) return undefined;
        return course.seasons.find(s => s.id === activeSeason) ?? course.seasons[0];
    }, [course, activeSeason]);

    const handleScrollToRelated = useCallback(() => {
        relatedRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handlePlay = useCallback(() => {
        const firstLesson = selectedSeason?.lessons?.[0];
        if (firstLesson) {
            alert(`Playing: ${firstLesson.title}`);
        }
    }, [selectedSeason]);

    if (isLoading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error || !course) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="text-center">
                <p className="text-xl font-semibold mb-4">Unable to load course. Please try again.</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-white text-black rounded-lg font-semibold">
                    Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] overflow-hidden">
                <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">{course.title}</h1>
                    {course.category && (
                        <span className="text-sm text-gray-300 mb-4">{course.category}</span>
                    )}
                    <p className="text-gray-300 max-w-2xl mb-6 text-sm md:text-base line-clamp-3">
                        {course.description}
                    </p>

                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={handlePlay}
                            className="flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition"
                        >
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Play
                        </button>
                        <button
                            onClick={handleScrollToRelated}
                            className="flex items-center gap-2 bg-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/30 transition backdrop-blur-sm"
                        >
                            Related Courses
                        </button>
                    </div>
                </div>
            </div>

            {/* Seasons Section */}
            <div className="px-8 md:px-16 py-10">
                <h2 className="text-xl font-bold mb-6">Seasons</h2>

                {/* Season Tabs */}
                <div className="flex gap-3 flex-wrap mb-6">
                    {course.seasons.map((season) => (
                        <button
                            key={season.id}
                            onClick={() => setActiveSeason(season.id)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                                (activeSeason ?? course.seasons[0]?.id) === season.id
                                    ? "bg-white text-black"
                                    : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                        >
                            {season.title}
                        </button>
                    ))}
                </div>

                {/* Lessons List */}
                {selectedSeason && (
                    <div className="flex flex-col gap-3">
                        {selectedSeason.lessons.map((lesson: LessonDto, index: number) => (
                            <div
                                key={lesson.id}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
                                onClick={() => alert(`Playing lesson: ${lesson.title}`)}
                            >
                                <span className="text-gray-400 w-6 text-center text-sm">{index + 1}</span>
                                <div className="flex-1">
                                    <p className="font-medium">{lesson.title}</p>
                                    {lesson.description && (
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">{lesson.description}</p>
                                    )}
                                </div>
                                <span className="text-sm text-gray-400">
                                    {Math.floor(lesson.durationSeconds / 60)}m {lesson.durationSeconds % 60}s
                                </span>
                                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        ))}
                    </div>
                )}

                {(!course.seasons.length) && (
                    <p className="text-gray-500">No seasons available for this course.</p>
                )}
            </div>

            {/* Related Courses */}
            <div ref={relatedRef} className="px-8 md:px-16 py-10 border-t border-white/10">
                <h2 className="text-xl font-bold mb-6">Related Courses</h2>
                {related?.length ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {related.slice(0, 15).map((c) => (
                            <div
                                key={c.id}
                                onClick={() => router.push(`/courses/${c.id}`)}
                                className="flex-shrink-0 w-48 cursor-pointer group"
                            >
                                <div className="relative w-48 h-28 rounded-lg overflow-hidden mb-2">
                                    <Image
                                        src={c.thumbnailUrl}
                                        alt={c.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-300"
                                        loading="lazy"
                                    />
                                    {c.progressPercent !== undefined && c.progressPercent > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${c.progressPercent}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm font-medium line-clamp-2 group-hover:text-gray-300 transition">
                                    {c.title}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No related courses found.</p>
                )}
            </div>
        </div>
    );
}
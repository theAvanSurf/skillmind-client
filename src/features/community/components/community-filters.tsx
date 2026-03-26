'use client';

import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type {
  CommunityCourse,
  CommunityExercise,
  CommunityFilters,
  ThreadSortBy,
} from "@/types/community.types";
import type { GenreType } from "@/types/resource.types";

type CommunityFiltersProps = {
  filters: CommunityFilters;
  courses: CommunityCourse[];
  exercises: CommunityExercise[];
  tags: string[];
  genres: GenreType[];
  onChange: (filters: CommunityFilters) => void;
};

const sortOptions: Array<{ value: ThreadSortBy; label: string }> = [
  { value: "most-upvoted", label: "Most Upvoted" },
  { value: "most-recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "most-discussed", label: "Most Discussed" },
];

const CommunityFiltersPanel: React.FC<CommunityFiltersProps> = ({
  filters,
  courses,
  exercises,
  tags,
  genres,
  onChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredExercises = useMemo(() => {
    if (!filters.courseId) return exercises;
    return exercises.filter((item) => item.courseId === filters.courseId);
  }, [exercises, filters.courseId]);

  const activeFiltersCount = useMemo(() => {
    return [filters.courseId, filters.exerciseId, filters.tag, filters.genre]
      .filter(Boolean)
      .length;
  }, [filters.courseId, filters.exerciseId, filters.genre, filters.tag]);

  const clearFilters = () => {
    onChange({
      ...filters,
      courseId: "",
      exerciseId: "",
      tag: "",
      genre: "",
    });
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
            placeholder="Search by title, tags, course or description..."
            className="w-full rounded-lg border border-white/8 bg-white/4 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:border-sky-500/50 focus:bg-white/6 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3.5 py-2.5 text-sm text-white/85 transition-all hover:border-white/14 hover:bg-white/7"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(event) =>
                onChange({
                  ...filters,
                  sortBy: event.target.value as ThreadSortBy,
                })
              }
              className="appearance-none rounded-lg border border-white/8 bg-white/4 py-2.5 pl-3.5 pr-9 text-sm text-white focus:border-sky-500/50 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#14141b]">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          </div>
        </div>
      </div>

      {showAdvanced && (
        <div className="rounded-lg border border-white/8 bg-white/4 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/55">
              Advanced Filters
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-sky-300 transition-colors hover:text-sky-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-1">
              <span className="text-[11px] text-white/45">Course</span>
              <select
                value={filters.courseId}
                onChange={(event) =>
                  onChange({
                    ...filters,
                    courseId: event.target.value,
                    exerciseId: "",
                  })
                }
                className="w-full rounded-md border border-white/8 bg-[#15151e] px-3 py-2 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">All courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] text-white/45">Exercise</span>
              <select
                value={filters.exerciseId}
                onChange={(event) =>
                  onChange({ ...filters, exerciseId: event.target.value })
                }
                className="w-full rounded-md border border-white/8 bg-[#15151e] px-3 py-2 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">All exercises</option>
                {filteredExercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] text-white/45">Tag</span>
              <select
                value={filters.tag}
                onChange={(event) =>
                  onChange({ ...filters, tag: event.target.value })
                }
                className="w-full rounded-md border border-white/8 bg-[#15151e] px-3 py-2 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">All tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] text-white/45">Genre</span>
              <select
                value={filters.genre}
                onChange={(event) =>
                  onChange({
                    ...filters,
                    genre: event.target.value as GenreType | "",
                  })
                }
                className="w-full rounded-md border border-white/8 bg-[#15151e] px-3 py-2 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">All genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.courseId && (
            <button
              onClick={() => onChange({ ...filters, courseId: "", exerciseId: "" })}
              className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-2.5 py-1 text-[11px] font-medium text-sky-300"
            >
              Course
              <X className="h-3 w-3" />
            </button>
          )}
          {filters.exerciseId && (
            <button
              onClick={() => onChange({ ...filters, exerciseId: "" })}
              className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2.5 py-1 text-[11px] font-medium text-purple-300"
            >
              Exercise
              <X className="h-3 w-3" />
            </button>
          )}
          {filters.tag && (
            <button
              onClick={() => onChange({ ...filters, tag: "" })}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300"
            >
              #{filters.tag}
              <X className="h-3 w-3" />
            </button>
          )}
          {filters.genre && (
            <button
              onClick={() => onChange({ ...filters, genre: "" })}
              className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-medium text-amber-300"
            >
              {filters.genre}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default CommunityFiltersPanel;

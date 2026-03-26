'use client';

import React, { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import type {
  CommunityCourse,
  CommunityExercise,
  CreateQuestionDTO,
} from "@/types/community.types";
import type { GenreType } from "@/types/resource.types";

type AskQuestionModalProps = {
  courses: CommunityCourse[];
  exercises: CommunityExercise[];
  genres: GenreType[];
  isSubmitting: boolean;
  submitError: string;
  onClose: () => void;
  onSubmit: (data: CreateQuestionDTO) => Promise<void>;
};

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  courses,
  exercises,
  genres,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [genre, setGenre] = useState<GenreType | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const visibleExercises = useMemo(() => {
    if (!courseId) return exercises;
    return exercises.filter((item) => item.courseId === courseId);
  }, [courseId, exercises]);

  const addTag = () => {
    const cleanTag = tagInput.trim().toLowerCase();
    if (!cleanTag || tags.includes(cleanTag)) return;
    setTags((prev) => [...prev, cleanTag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (title.trim().length > 0 && title.trim().length < 6) {
      nextErrors.title = "Title must have at least 6 characters.";
    }

    if (description.trim().length > 0 && description.trim().length < 20) {
      nextErrors.description = "Description must have at least 20 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      courseId: courseId || undefined,
      exerciseId: exerciseId || undefined,
      seasonId: seasonId || undefined,
      genre: genre || undefined,
      tags: tags.length ? tags : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/8 bg-[#12121a]">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#12121a] px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Ask a Question</h2>
            <p className="text-xs text-white/50">
              Ask about a course, season, exercise, or any learning topic.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/55 transition-colors hover:bg-white/8 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 p-5">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-white">
              Title <span className="text-rose-400">*</span>
            </span>
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="What are you stuck on?"
              className={`w-full rounded-lg border bg-white/4 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none ${
                errors.title ? "border-rose-400/60" : "border-white/10 focus:border-sky-500/50"
              }`}
            />
            {errors.title && <p className="text-xs text-rose-300">{errors.title}</p>}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-white">
              Description <span className="text-rose-400">*</span>
            </span>
            <textarea
              rows={5}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              placeholder="Share what you tried and where exactly you got stuck..."
              className={`w-full rounded-lg border bg-white/4 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none ${
                errors.description
                  ? "border-rose-400/60"
                  : "border-white/10 focus:border-sky-500/50"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-300">{errors.description}</p>
            )}
          </label>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs text-white/55">Related Course (recommended)</span>
              <select
                value={courseId}
                onChange={(event) => {
                  setCourseId(event.target.value);
                  setExerciseId("");
                }}
                className="w-full rounded-lg border border-white/10 bg-[#15151e] px-3 py-2.5 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs text-white/55">Related Exercise (optional)</span>
              <select
                value={exerciseId}
                onChange={(event) => setExerciseId(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#15151e] px-3 py-2.5 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">Select exercise</option>
                {visibleExercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs text-white/55">Season (optional)</span>
              <select
                value={seasonId}
                onChange={(event) => setSeasonId(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#15151e] px-3 py-2.5 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">Select season</option>
                <option value="season-1">Season 1</option>
                <option value="season-2">Season 2</option>
                <option value="season-3">Season 3</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs text-white/55">Genre</span>
              <select
                value={genre}
                onChange={(event) => setGenre(event.target.value as GenreType | "")}
                className="w-full rounded-lg border border-white/10 bg-[#15151e] px-3 py-2.5 text-sm text-white focus:border-sky-500/50 focus:outline-none"
              >
                <option value="">Select genre</option>
                {genres.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-white/55">Tags (recommended)</span>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                className="w-full rounded-lg border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-sky-500/50 focus:outline-none"
                placeholder="react, hooks, debugging..."
              />
              <button
                onClick={addTag}
                className="rounded-lg bg-sky-500 px-3 py-2 text-white transition-colors hover:bg-sky-400"
                aria-label="Add tag"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => removeTag(tag)}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-2.5 py-1 text-[11px] text-sky-300"
                  >
                    #{tag}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {submitError && (
            <div className="rounded-lg border border-rose-500/35 bg-rose-500/10 p-3 text-sm text-rose-200">
              {submitError}
            </div>
          )}
        </div>

        <footer className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-white/8 bg-[#12121a] px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/4 px-4 py-2 text-sm text-white/80 transition-all hover:border-white/14 hover:bg-white/7"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isSubmitting}
            className="rounded-lg bg-linear-to-r from-sky-500 to-blue-500 px-5 py-2 text-sm font-medium text-white transition-all hover:from-sky-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Question"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AskQuestionModal;

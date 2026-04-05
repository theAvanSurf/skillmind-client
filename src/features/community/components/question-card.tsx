import React from "react";
import Link from "next/link";
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageSquare,
  Eye,
  CheckCircle2,
  Lock,
  Flag,
} from "lucide-react";
import type { CommunityQuestion, VoteValue } from "@/types/community.types";

type QuestionCardProps = {
  question: CommunityQuestion;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onVote: (id: string, vote: VoteValue) => void;
  onReport: (id: string) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isSelected,
  onSelect,
  onVote,
  onReport,
}) => {
  const score = question.votes.upvotes - question.votes.downvotes;

  return (
    <article
      className={`rounded-xl border p-4 transition-all ${
        isSelected
          ? "border-sky-500/45 bg-sky-500/10"
          : "border-white/8 bg-white/4 hover:border-white/14 hover:bg-white/7"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex min-w-12 flex-col items-center gap-1 rounded-lg border border-white/10 bg-[#13131c] px-1 py-2">
          <button
            onClick={() => onVote(question.id, 1)}
            className={`rounded p-1 transition-colors ${
              question.votes.userVote === 1 ? "text-sky-300" : "text-white/45 hover:text-white"
            }`}
            aria-label="Upvote question"
          >
            <ArrowBigUp className="h-4 w-4" />
          </button>
          <p className="text-sm font-semibold text-white">{score}</p>
          <button
            onClick={() => onVote(question.id, -1)}
            className={`rounded p-1 transition-colors ${
              question.votes.userVote === -1 ? "text-rose-300" : "text-white/45 hover:text-white"
            }`}
            aria-label="Downvote question"
          >
            <ArrowBigDown className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-white/45">
            <span className="font-medium text-white/70">{question.author.name}</span>
            <span>•</span>
            <span>{new Date(question.createdAt).toLocaleString()}</span>
            {question.status === "solved" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                Solved
              </span>
            )}
            {question.isLocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-rose-300">
                <Lock className="h-3 w-3" />
                Locked
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(question.id)}
            className="mb-2 text-left text-base font-semibold text-white transition-colors hover:text-sky-300"
          >
            {question.title}
          </button>

          <p className="line-clamp-2 text-sm text-white/65">{question.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/7 px-2.5 py-1 text-[11px] text-white/65"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/50">
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {question.repliesCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {question.views}
              </span>

              {question.context.courseId && question.context.courseName && (
                <Link
                  href={`/my-courses?course=${question.context.courseId}`}
                  className="rounded-full bg-blue-500/15 px-2 py-0.5 text-blue-300 transition-colors hover:text-blue-200"
                >
                  {question.context.courseName}
                </Link>
              )}

              {question.context.seasonId && question.context.seasonName && (
                <Link
                  href={`/main?season=${question.context.seasonId}`}
                  className="rounded-full bg-purple-500/15 px-2 py-0.5 text-purple-300 transition-colors hover:text-purple-200"
                >
                  {question.context.seasonName}
                </Link>
              )}

              {question.context.exerciseId && question.context.exerciseName && (
                <Link
                  href={`/my-courses?exercise=${question.context.exerciseId}`}
                  className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300 transition-colors hover:text-emerald-200"
                >
                  {question.context.exerciseName}
                </Link>
              )}
            </div>

            <button
              onClick={() => onReport(question.id)}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-[11px] text-white/60 transition-all hover:border-rose-400/40 hover:text-rose-200"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default QuestionCard;

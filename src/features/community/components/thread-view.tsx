'use client';

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowBigDown,
  ArrowBigUp,
  Flag,
  Loader2,
  Lock,
  LockOpen,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import ThreadReplyNode from "./thread-reply-node";
import type {
  CommunityQuestion,
  ThreadSortBy,
  ThreadedReply,
  VoteValue,
} from "@/types/community.types";

type ThreadViewProps = {
  question: CommunityQuestion | null;
  replies: ThreadedReply[];
  loading: boolean;
  error: string;
  currentUserId: string;
  canModerate: boolean;
  sortBy: ThreadSortBy;
  collapsedReplyIds: Set<string>;
  onRetryLoad: () => void;
  onSortChange: (sortBy: ThreadSortBy) => void;
  onToggleCollapse: (id: string) => void;
  onVoteQuestion: (id: string, vote: VoteValue) => void;
  onVoteReply: (id: string, vote: VoteValue) => void;
  onReply: (parentReplyId: string | undefined, body: string) => Promise<void>;
  onEditReply: (replyId: string, body: string) => void;
  onDeleteReply: (replyId: string) => void;
  onReportQuestion: (questionId: string) => void;
  onReportReply: (replyId: string) => void;
  onMarkAccepted: (replyId: string) => void;
  onToggleLock: (questionId: string) => void;
};

const replySortOptions: Array<{ value: ThreadSortBy; label: string }> = [
  { value: "most-upvoted", label: "Most Upvoted" },
  { value: "most-recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "most-discussed", label: "Most Discussed" },
];

const flattenReplies = (nodes: ThreadedReply[]): ThreadedReply[] => {
  const stack = [...nodes];
  const flat: ThreadedReply[] = [];

  while (stack.length > 0) {
    const item = stack.shift();
    if (!item) continue;
    flat.push(item);
    if (item.children.length > 0) {
      stack.unshift(...item.children);
    }
  }

  return flat;
};

const ThreadView: React.FC<ThreadViewProps> = ({
  question,
  replies,
  loading,
  error,
  currentUserId,
  canModerate,
  sortBy,
  collapsedReplyIds,
  onRetryLoad,
  onSortChange,
  onToggleCollapse,
  onVoteQuestion,
  onVoteReply,
  onReply,
  onEditReply,
  onDeleteReply,
  onReportQuestion,
  onReportReply,
  onMarkAccepted,
  onToggleLock,
}) => {
  const [rootReplyText, setRootReplyText] = useState("");
  const [rootReplyError, setRootReplyError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [visibleTopLevelCount, setVisibleTopLevelCount] = useState(5);

  useEffect(() => {
    setRootReplyText("");
    setRootReplyError("");
    setVisibleTopLevelCount(5);
  }, [question?.id]);

  const score = question
    ? question.votes.upvotes - question.votes.downvotes
    : 0;

  const isQuestionAuthor = question?.author.id === currentUserId;

  const acceptedReply = useMemo(() => {
    if (!question?.acceptedReplyId) return null;
    const flat = flattenReplies(replies);
    return flat.find((item) => item.id === question.acceptedReplyId) ?? null;
  }, [question?.acceptedReplyId, replies]);

  const visibleReplies = useMemo(() => {
    return replies.slice(0, visibleTopLevelCount);
  }, [replies, visibleTopLevelCount]);

  const submitRootReply = async () => {
    const cleanText = rootReplyText.trim();

    if (!cleanText) {
      setRootReplyError("Reply cannot be empty.");
      return;
    }

    if (cleanText.length < 3) {
      setRootReplyError("Reply must have at least 3 characters.");
      return;
    }

    setRootReplyError("");
    setIsPosting(true);

    try {
      await onReply(undefined, cleanText);
      setRootReplyText("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not post your reply. Please retry.";
      setRootReplyError(message);
    } finally {
      setIsPosting(false);
    }
  };

  if (!question) {
    return (
      <section className="rounded-xl border border-dashed border-white/12 bg-white/3 p-7 text-center text-sm text-white/55">
        Select a thread from the left panel to see full discussion.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <article className="rounded-xl border border-white/8 bg-white/4 p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span className="font-medium text-white/75">{question.author.name}</span>
            <span>•</span>
            <span>{new Date(question.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            {canModerate && (
              <button
                onClick={() => onToggleLock(question.id)}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-[11px] text-white/75 transition-all hover:border-white/14 hover:text-white"
              >
                {question.isLocked ? (
                  <>
                    <LockOpen className="h-3.5 w-3.5" />
                    Unlock
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Lock
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onReportQuestion(question.id)}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-[11px] text-white/60 transition-all hover:border-rose-400/40 hover:text-rose-200"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </button>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-semibold text-white">{question.title}</h2>
        <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
          {question.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/7 px-2.5 py-1 text-[11px] text-white/65"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px]">
          {question.context.courseId && question.context.courseName && (
            <Link
              href={`/my-courses?course=${question.context.courseId}`}
              className="rounded-full bg-blue-500/15 px-2 py-0.5 text-blue-300"
            >
              {question.context.courseName}
            </Link>
          )}
          {question.context.seasonId && question.context.seasonName && (
            <Link
              href={`/main?season=${question.context.seasonId}`}
              className="rounded-full bg-violet-500/15 px-2 py-0.5 text-violet-300"
            >
              {question.context.seasonName}
            </Link>
          )}
          {question.context.exerciseId && question.context.exerciseName && (
            <Link
              href={`/my-courses?exercise=${question.context.exerciseId}`}
              className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300"
            >
              {question.context.exerciseName}
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#12121b] p-2.5">
          <div className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-[#0f0f16] px-1.5 py-1">
            <button
              onClick={() => onVoteQuestion(question.id, 1)}
              className={`rounded p-0.5 transition-colors ${
                question.votes.userVote === 1 ? "text-sky-300" : "text-white/45 hover:text-white"
              }`}
            >
              <ArrowBigUp className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-white">{score}</span>
            <button
              onClick={() => onVoteQuestion(question.id, -1)}
              className={`rounded p-0.5 transition-colors ${
                question.votes.userVote === -1 ? "text-rose-300" : "text-white/45 hover:text-white"
              }`}
            >
              <ArrowBigDown className="h-4 w-4" />
            </button>
          </div>

          <div className="inline-flex items-center gap-1 text-xs text-white/55">
            <MessageSquare className="h-3.5 w-3.5" />
            {question.repliesCount} replies
          </div>
        </div>
      </article>

      {acceptedReply && (
        <article className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-4">
          <h3 className="mb-2 text-sm font-semibold text-emerald-200">Accepted Answer</h3>
          <p className="mb-2 text-xs text-emerald-100/75">By {acceptedReply.author.name}</p>
          <p className="whitespace-pre-wrap text-sm text-white/85">{acceptedReply.body}</p>
        </article>
      )}

      <section className="rounded-xl border border-white/8 bg-white/4 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Thread Replies</h3>

          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as ThreadSortBy)}
            className="rounded-md border border-white/10 bg-[#15151e] px-3 py-1.5 text-xs text-white focus:border-sky-500/50 focus:outline-none"
          >
            {replySortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {!question.isLocked && (
          <div className="mb-4 rounded-lg border border-white/10 bg-[#151521] p-3">
            <textarea
              rows={3}
              value={rootReplyText}
              onChange={(event) => {
                setRootReplyText(event.target.value);
                if (rootReplyError) setRootReplyError("");
              }}
              placeholder="Share your answer with the community..."
              className="w-full rounded-md border border-white/10 bg-[#101018] px-2.5 py-2 text-sm text-white placeholder:text-white/35 focus:border-sky-500/50 focus:outline-none"
            />
            {rootReplyError && (
              <p className="mt-2 text-xs text-rose-300">{rootReplyError}</p>
            )}
            <div className="mt-2 flex justify-end">
              <button
                onClick={submitRootReply}
                disabled={isPosting}
                className="rounded-md bg-linear-to-r from-sky-500 to-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:from-sky-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isPosting ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>
        )}

        {question.isLocked && (
          <div className="mb-4 rounded-lg border border-amber-500/35 bg-amber-500/10 p-3 text-xs text-amber-200">
            This thread is locked. New replies are disabled.
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-7 text-sm text-white/60">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading thread...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-200">
            <p className="mb-2">{error}</p>
            <button
              onClick={onRetryLoad}
              className="inline-flex items-center gap-1 rounded-md bg-rose-500/20 px-2.5 py-1 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && replies.length === 0 && (
          <div className="rounded-lg border border-dashed border-white/12 bg-white/2 p-4 text-sm text-white/50">
            No replies yet. Be the first to answer.
          </div>
        )}

        {!loading && !error && visibleReplies.length > 0 && (
          <div>
            {visibleReplies.map((reply) => (
              <ThreadReplyNode
                key={reply.id}
                reply={reply}
                depth={0}
                acceptedReplyId={question.acceptedReplyId}
                currentUserId={currentUserId}
                canModerate={canModerate}
                isQuestionAuthor={isQuestionAuthor}
                questionLocked={question.isLocked}
                collapsedReplyIds={collapsedReplyIds}
                onToggleCollapse={onToggleCollapse}
                onVote={onVoteReply}
                onReply={(parentReplyId, body) => onReply(parentReplyId, body)}
                onEdit={onEditReply}
                onDelete={onDeleteReply}
                onReport={onReportReply}
                onMarkAccepted={onMarkAccepted}
              />
            ))}

            {visibleTopLevelCount < replies.length && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setVisibleTopLevelCount((prev) => prev + 5)}
                  className="rounded-md border border-white/10 bg-white/4 px-3 py-1.5 text-xs text-white/70 transition-all hover:border-white/14 hover:bg-white/7 hover:text-white"
                >
                  Load more replies
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </section>
  );
};

export default ThreadView;

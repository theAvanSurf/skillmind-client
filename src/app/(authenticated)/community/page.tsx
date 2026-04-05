'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, MessageCirclePlus, RefreshCw, Shield } from "lucide-react";
import CommunityStats from "@/features/community/components/community-stats";
import CommunityNotifications from "@/features/community/components/community-notifications";
import CommunityFiltersPanel from "@/features/community/components/community-filters";
import QuestionCard from "@/features/community/components/question-card";
import AskQuestionModal from "@/features/community/components/ask-question-modal";
import ThreadView from "@/features/community/components/thread-view";
import {
  communityCourses,
  communityExercises,
  currentCommunityUser,
  mockNotifications,
  mockQuestions,
  mockReplies,
} from "./mock-data";
import type {
  CommunityFilters,
  CommunityNotification,
  CommunityQuestion,
  CommunityReply,
  ThreadSortBy,
  ThreadedReply,
  UserRole,
  VoteInfo,
  VoteValue,
} from "@/types/community.types";
import type { GenreType } from "@/types/resource.types";

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const applyVote = (votes: VoteInfo, vote: VoteValue): VoteInfo => {
  const nextVote: VoteValue = votes.userVote === vote ? 0 : vote;

  let nextUpvotes = votes.upvotes;
  let nextDownvotes = votes.downvotes;

  if (votes.userVote === 1) nextUpvotes -= 1;
  if (votes.userVote === -1) nextDownvotes -= 1;

  if (nextVote === 1) nextUpvotes += 1;
  if (nextVote === -1) nextDownvotes += 1;

  return {
    upvotes: Math.max(0, nextUpvotes),
    downvotes: Math.max(0, nextDownvotes),
    userVote: nextVote,
  };
};

const sortQuestions = (
  questions: CommunityQuestion[],
  sortBy: ThreadSortBy
): CommunityQuestion[] => {
  const copy = [...questions];

  switch (sortBy) {
    case "most-upvoted":
      copy.sort(
        (a, b) =>
          b.votes.upvotes - b.votes.downvotes - (a.votes.upvotes - a.votes.downvotes)
      );
      break;
    case "most-recent":
      copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      copy.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "most-discussed":
      copy.sort((a, b) => b.repliesCount - a.repliesCount);
      break;
  }

  return copy;
};

const buildThreadTree = (
  replies: CommunityReply[],
  sortBy: ThreadSortBy
): ThreadedReply[] => {
  const repliesByParent = new Map<string, CommunityReply[]>();
  const childCountMap = new Map<string, number>();

  for (const reply of replies) {
    const parentKey = reply.parentReplyId ?? "root";
    const list = repliesByParent.get(parentKey) ?? [];
    list.push(reply);
    repliesByParent.set(parentKey, list);

    if (reply.parentReplyId) {
      childCountMap.set(
        reply.parentReplyId,
        (childCountMap.get(reply.parentReplyId) ?? 0) + 1
      );
    }
  }

  const sortList = (list: CommunityReply[]) => {
    const copy = [...list];

    switch (sortBy) {
      case "most-upvoted":
        copy.sort(
          (a, b) =>
            b.votes.upvotes - b.votes.downvotes - (a.votes.upvotes - a.votes.downvotes)
        );
        break;
      case "most-recent":
        copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        copy.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "most-discussed":
        copy.sort(
          (a, b) =>
            (childCountMap.get(b.id) ?? 0) - (childCountMap.get(a.id) ?? 0)
        );
        break;
    }

    return copy;
  };

  const buildNodes = (parentId?: string): ThreadedReply[] => {
    const key = parentId ?? "root";
    const children = sortList(repliesByParent.get(key) ?? []);

    return children.map((child) => ({
      ...child,
      children: buildNodes(child.id),
    }));
  };

  return buildNodes();
};

const isModeratorRole = (role: UserRole) => role === "admin" || role === "moderator";

const defaultFilters: CommunityFilters = {
  search: "",
  courseId: "",
  exerciseId: "",
  tag: "",
  genre: "",
  sortBy: "most-upvoted",
};

export default function CommunityPage() {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);

  const [filters, setFilters] = useState<CommunityFilters>(defaultFilters);
  const [threadSortBy, setThreadSortBy] = useState<ThreadSortBy>("most-upvoted");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [threadError, setThreadError] = useState("");

  const [visibleQuestionCount, setVisibleQuestionCount] = useState(8);
  const [collapsedReplyIds, setCollapsedReplyIds] = useState<Set<string>>(new Set());

  const [showAskModal, setShowAskModal] = useState(false);
  const [isPostingQuestion, setIsPostingQuestion] = useState(false);
  const [questionSubmitError, setQuestionSubmitError] = useState("");

  const [moderatorMode, setModeratorMode] = useState(false);
  const effectiveRole: UserRole = moderatorMode
    ? "moderator"
    : currentCommunityUser.role;
  const canModerate = isModeratorRole(effectiveRole);

  const loadInitialData = useCallback(async () => {
    setLoadingQuestions(true);
    setLoadError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 240));
      setQuestions(deepClone(mockQuestions));
      setReplies(deepClone(mockReplies));
      setNotifications(deepClone(mockNotifications));
      setSelectedQuestionId(mockQuestions[0]?.id ?? null);
    } catch {
      setLoadError("Could not load community threads. Please retry.");
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!selectedQuestionId) return;

    setLoadingThread(true);
    setThreadError("");

    const timerId = window.setTimeout(() => {
      setLoadingThread(false);
    }, 220);

    return () => window.clearTimeout(timerId);
  }, [selectedQuestionId]);

  const stats = useMemo(() => {
    const solvedQuestions = questions.filter((question) => question.status === "solved").length;
    const openQuestions = questions.filter((question) => question.status === "open").length;

    return {
      totalQuestions: questions.length,
      solvedQuestions,
      openQuestions,
      totalReplies: replies.filter((reply) => !reply.isDeleted).length,
    };
  }, [questions, replies]);

  const availableTags = useMemo(() => {
    return Array.from(
      new Set(questions.flatMap((question) => question.tags))
    ).sort();
  }, [questions]);

  const availableGenres = useMemo(() => {
    return Array.from(
      new Set(communityCourses.map((course) => course.genre))
    ) as GenreType[];
  }, []);

  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter((question) => {
        const courseName = question.context.courseName?.toLowerCase() ?? "";

        return (
          question.title.toLowerCase().includes(term) ||
          question.description.toLowerCase().includes(term) ||
          courseName.includes(term) ||
          question.tags.some((tag) => tag.toLowerCase().includes(term))
        );
      });
    }

    if (filters.courseId) {
      result = result.filter((question) => question.context.courseId === filters.courseId);
    }

    if (filters.exerciseId) {
      result = result.filter(
        (question) => question.context.exerciseId === filters.exerciseId
      );
    }

    if (filters.tag) {
      result = result.filter((question) => question.tags.includes(filters.tag));
    }

    if (filters.genre) {
      result = result.filter((question) => question.context.genre === filters.genre);
    }

    return sortQuestions(result, filters.sortBy);
  }, [filters, questions]);

  const visibleQuestions = useMemo(
    () => filteredQuestions.slice(0, visibleQuestionCount),
    [filteredQuestions, visibleQuestionCount]
  );

  useEffect(() => {
    setVisibleQuestionCount(8);
  }, [filters]);

  useEffect(() => {
    if (filteredQuestions.length === 0) {
      setSelectedQuestionId(null);
      return;
    }

    const selectedExists = filteredQuestions.some(
      (question) => question.id === selectedQuestionId
    );

    if (!selectedExists) {
      setSelectedQuestionId(filteredQuestions[0].id);
    }
  }, [filteredQuestions, selectedQuestionId]);

  const selectedQuestion = useMemo(() => {
    if (!selectedQuestionId) return null;
    return questions.find((question) => question.id === selectedQuestionId) ?? null;
  }, [questions, selectedQuestionId]);

  const selectedReplies = useMemo(() => {
    if (!selectedQuestionId) return [];
    return replies.filter((reply) => reply.questionId === selectedQuestionId);
  }, [replies, selectedQuestionId]);

  const threadedReplies = useMemo(
    () => buildThreadTree(selectedReplies, threadSortBy),
    [selectedReplies, threadSortBy]
  );

  const handleVoteQuestion = useCallback((questionId: string, vote: VoteValue) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, votes: applyVote(question.votes, vote) }
          : question
      )
    );
  }, []);

  const handleVoteReply = useCallback((replyId: string, vote: VoteValue) => {
    setReplies((prev) =>
      prev.map((reply) =>
        reply.id === replyId
          ? { ...reply, votes: applyVote(reply.votes, vote) }
          : reply
      )
    );
  }, []);

  const handleReportQuestion = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, reports: question.reports + 1 }
          : question
      )
    );
  }, []);

  const handleReportReply = useCallback((replyId: string) => {
    setReplies((prev) =>
      prev.map((reply) =>
        reply.id === replyId
          ? { ...reply, reports: reply.reports + 1 }
          : reply
      )
    );
  }, []);

  const handleAddReply = useCallback(
    async (parentReplyId: string | undefined, body: string) => {
      if (!selectedQuestionId) {
        throw new Error("No question selected.");
      }

      if (body.toLowerCase().includes("[fail]")) {
        throw new Error("Posting failed due to a simulated network error.");
      }

      await new Promise((resolve) => setTimeout(resolve, 240));

      const now = new Date().toISOString();
      const parentReply = parentReplyId
        ? replies.find((reply) => reply.id === parentReplyId)
        : undefined;

      const newReply: CommunityReply = {
        id: `reply-${Date.now()}`,
        questionId: selectedQuestionId,
        parentReplyId,
        parentAuthorName: parentReply?.author.name,
        body,
        author: currentCommunityUser,
        votes: { upvotes: 0, downvotes: 0, userVote: 0 },
        reports: 0,
        createdAt: now,
        updatedAt: now,
      };

      setReplies((prev) => [...prev, newReply]);

      setQuestions((prev) =>
        prev.map((question) =>
          question.id === selectedQuestionId
            ? {
                ...question,
                repliesCount: question.repliesCount + 1,
                updatedAt: now,
              }
            : question
        )
      );

      const question = questions.find((item) => item.id === selectedQuestionId);
      const notifiedUser = parentReply?.author ?? question?.author;

      if (notifiedUser && notifiedUser.id !== currentCommunityUser.id) {
        const notification: CommunityNotification = {
          id: `not-${Date.now()}`,
          type: parentReply ? "reply_comment" : "reply_question",
          questionId: selectedQuestionId,
          replyId: newReply.id,
          actorName: currentCommunityUser.name,
          message: parentReply
            ? `${currentCommunityUser.name} replied to your comment.`
            : `${currentCommunityUser.name} replied to your question.`,
          isRead: false,
          createdAt: now,
        };

        setNotifications((prev) => [notification, ...prev]);
      }
    },
    [questions, replies, selectedQuestionId]
  );

  const handleEditReply = useCallback((replyId: string, body: string) => {
    const now = new Date().toISOString();

    setReplies((prev) =>
      prev.map((reply) =>
        reply.id === replyId
          ? {
              ...reply,
              body,
              updatedAt: now,
            }
          : reply
      )
    );
  }, []);

  const handleDeleteReply = useCallback((replyId: string) => {
    const now = new Date().toISOString();

    setReplies((prev) =>
      prev.map((reply) =>
        reply.id === replyId
          ? {
              ...reply,
              isDeleted: true,
              body: "",
              updatedAt: now,
            }
          : reply
      )
    );
  }, []);

  const handleMarkAccepted = useCallback(
    (replyId: string) => {
      if (!selectedQuestionId) return;

      const now = new Date().toISOString();
      const acceptedReply = replies.find((reply) => reply.id === replyId);

      setQuestions((prev) =>
        prev.map((question) =>
          question.id === selectedQuestionId
            ? {
                ...question,
                acceptedReplyId: replyId,
                status: "solved",
                updatedAt: now,
              }
            : question
        )
      );

      if (acceptedReply && acceptedReply.author.id !== currentCommunityUser.id) {
        setNotifications((prev) => [
          {
            id: `not-${Date.now()}`,
            type: "accepted_answer",
            questionId: selectedQuestionId,
            replyId,
            actorName: currentCommunityUser.name,
            message: "Your answer was marked as accepted.",
            isRead: false,
            createdAt: now,
          },
          ...prev,
        ]);
      }
    },
    [replies, selectedQuestionId]
  );

  const handleToggleLock = useCallback(
    (questionId: string) => {
      if (!canModerate) return;

      setQuestions((prev) =>
        prev.map((question) => {
          if (question.id !== questionId) return question;

          const nextLocked = !question.isLocked;
          const nextStatus = nextLocked
            ? "locked"
            : question.acceptedReplyId
            ? "solved"
            : "open";

          return {
            ...question,
            isLocked: nextLocked,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    [canModerate]
  );

  const handleToggleCollapse = useCallback((replyId: string) => {
    setCollapsedReplyIds((prev) => {
      const next = new Set(prev);
      if (next.has(replyId)) {
        next.delete(replyId);
      } else {
        next.add(replyId);
      }
      return next;
    });
  }, []);

  const handleSubmitQuestion = useCallback(
    async (payload: {
      title: string;
      description: string;
      courseId?: string;
      seasonId?: string;
      exerciseId?: string;
      genre?: GenreType;
      tags?: string[];
    }) => {
      setQuestionSubmitError("");
      setIsPostingQuestion(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 420));

        if (payload.title.toLowerCase().includes("[fail]")) {
          throw new Error("Could not post question. Please retry.");
        }

        const now = new Date().toISOString();
        const linkedCourse = communityCourses.find((course) => course.id === payload.courseId);
        const linkedExercise = communityExercises.find(
          (exercise) => exercise.id === payload.exerciseId
        );

        const newQuestion: CommunityQuestion = {
          id: `q-${Date.now()}`,
          title: payload.title,
          description: payload.description,
          tags: payload.tags ?? [],
          context: {
            courseId: payload.courseId,
            courseName: linkedCourse?.name,
            seasonId: payload.seasonId,
            seasonName: payload.seasonId
              ? payload.seasonId.replace("season-", "Season ")
              : undefined,
            exerciseId: payload.exerciseId,
            exerciseName: linkedExercise?.name,
            genre: payload.genre,
          },
          author: currentCommunityUser,
          status: "open",
          votes: { upvotes: 0, downvotes: 0, userVote: 0 },
          repliesCount: 0,
          views: 0,
          reports: 0,
          isLocked: false,
          createdAt: now,
          updatedAt: now,
        };

        setQuestions((prev) => [newQuestion, ...prev]);
        setSelectedQuestionId(newQuestion.id);
        setShowAskModal(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not create question. Please retry.";
        setQuestionSubmitError(message);
      } finally {
        setIsPostingQuestion(false);
      }
    },
    []
  );

  const handleMarkNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  }, []);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  }, []);

  if (loadingQuestions) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-white/65">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading community page...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-rose-500/35 bg-rose-500/10 p-6 text-center">
        <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-rose-300" />
        <p className="mb-3 text-sm text-rose-100">{loadError}</p>
        <button
          onClick={loadInitialData}
          className="inline-flex items-center gap-1 rounded-md bg-rose-500/20 px-3 py-1.5 text-sm text-rose-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-400">Learning Hub</p>
          <h1 className="text-3xl font-semibold text-white">Community Forum</h1>
          <p className="text-sm text-white/45">
            Ask questions, discuss exercises, and learn with threaded Q&A.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModeratorMode((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-all ${
              moderatorMode
                ? "border-emerald-500/45 bg-emerald-500/15 text-emerald-200"
                : "border-white/10 bg-white/4 text-white/75 hover:border-white/14 hover:text-white"
            }`}
          >
            <Shield className="h-4 w-4" />
            {moderatorMode ? "Moderator Mode" : "Student Mode"}
          </button>

          <button
            onClick={() => {
              setQuestionSubmitError("");
              setShowAskModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-sky-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-sky-400 hover:to-blue-400"
          >
            <MessageCirclePlus className="h-4 w-4" />
            Ask Question
          </button>
        </div>
      </header>

      <CommunityStats
        totalQuestions={stats.totalQuestions}
        solvedQuestions={stats.solvedQuestions}
        openQuestions={stats.openQuestions}
        totalReplies={stats.totalReplies}
      />

      <CommunityFiltersPanel
        filters={filters}
        courses={communityCourses}
        exercises={communityExercises}
        tags={availableTags}
        genres={availableGenres}
        onChange={setFilters}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <div className="rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-xs text-white/60">
            Showing {visibleQuestions.length} of {filteredQuestions.length} matching threads
          </div>

          {visibleQuestions.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/12 bg-white/3 p-6 text-center text-sm text-white/55">
              No threads match your filters.
            </div>
          )}

          <div className="space-y-3">
            {visibleQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                isSelected={selectedQuestionId === question.id}
                onSelect={setSelectedQuestionId}
                onVote={handleVoteQuestion}
                onReport={handleReportQuestion}
              />
            ))}
          </div>

          {visibleQuestionCount < filteredQuestions.length && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleQuestionCount((prev) => prev + 8)}
                className="rounded-md border border-white/10 bg-white/4 px-3.5 py-1.5 text-xs text-white/75 transition-all hover:border-white/14 hover:bg-white/7 hover:text-white"
              >
                Load more threads
              </button>
            </div>
          )}

          <CommunityNotifications
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationRead}
            onMarkAllAsRead={handleMarkAllNotificationsRead}
          />
        </div>

        <ThreadView
          question={selectedQuestion}
          replies={threadedReplies}
          loading={loadingThread}
          error={threadError}
          currentUserId={currentCommunityUser.id}
          canModerate={canModerate}
          sortBy={threadSortBy}
          collapsedReplyIds={collapsedReplyIds}
          onRetryLoad={() => setThreadError("")}
          onSortChange={setThreadSortBy}
          onToggleCollapse={handleToggleCollapse}
          onVoteQuestion={handleVoteQuestion}
          onVoteReply={handleVoteReply}
          onReply={handleAddReply}
          onEditReply={handleEditReply}
          onDeleteReply={handleDeleteReply}
          onReportQuestion={handleReportQuestion}
          onReportReply={handleReportReply}
          onMarkAccepted={handleMarkAccepted}
          onToggleLock={handleToggleLock}
        />
      </div>

      {showAskModal && (
        <AskQuestionModal
          courses={communityCourses}
          exercises={communityExercises}
          genres={availableGenres}
          isSubmitting={isPostingQuestion}
          submitError={questionSubmitError}
          onClose={() => setShowAskModal(false)}
          onSubmit={handleSubmitQuestion}
        />
      )}
    </div>
  );
}

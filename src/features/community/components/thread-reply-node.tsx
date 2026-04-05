'use client';

import React, { useMemo, useState } from "react";
import {
  ArrowBigDown,
  ArrowBigUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Flag,
  Pencil,
  Reply,
  Trash2,
} from "lucide-react";
import type { ThreadedReply, VoteValue } from "@/types/community.types";

type ThreadReplyNodeProps = {
  reply: ThreadedReply;
  depth: number;
  acceptedReplyId?: string;
  currentUserId: string;
  canModerate: boolean;
  isQuestionAuthor: boolean;
  questionLocked: boolean;
  collapsedReplyIds: Set<string>;
  onToggleCollapse: (id: string) => void;
  onVote: (id: string, vote: VoteValue) => void;
  onReply: (parentReplyId: string, body: string) => Promise<void>;
  onEdit: (replyId: string, body: string) => void;
  onDelete: (replyId: string) => void;
  onReport: (replyId: string) => void;
  onMarkAccepted: (replyId: string) => void;
};

const EDIT_WINDOW_MINUTES = 30;

const ThreadReplyNode: React.FC<ThreadReplyNodeProps> = ({
  reply,
  depth,
  acceptedReplyId,
  currentUserId,
  canModerate,
  isQuestionAuthor,
  questionLocked,
  collapsedReplyIds,
  onToggleCollapse,
  onVote,
  onReply,
  onEdit,
  onDelete,
  onReport,
  onMarkAccepted,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.body);

  const hasChildren = reply.children.length > 0;
  const isCollapsed = collapsedReplyIds.has(reply.id);
  const isAccepted = acceptedReplyId === reply.id;
  const isOwner = reply.author.id === currentUserId;

  const canEditOwnReply = useMemo(() => {
    if (!isOwner) return false;
    const diffMs = Date.now() - new Date(reply.createdAt).getTime();
    return diffMs <= EDIT_WINDOW_MINUTES * 60 * 1000;
  }, [isOwner, reply.createdAt]);

  const canEdit = !reply.isDeleted && (canModerate || canEditOwnReply);
  const canDelete = !reply.isDeleted && (canModerate || isOwner);
  const score = reply.votes.upvotes - reply.votes.downvotes;

  const submitReply = async () => {
    const cleanText = replyText.trim();

    if (!cleanText) {
      setReplyError("Reply cannot be empty.");
      return;
    }

    if (cleanText.length < 3) {
      setReplyError("Reply must have at least 3 characters.");
      return;
    }

    setReplyError("");
    setIsReplying(true);

    try {
      await onReply(reply.id, cleanText);
      setReplyText("");
      setShowReplyForm(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not post reply. Try again in a moment.";
      setReplyError(message);
    } finally {
      setIsReplying(false);
    }
  };

  const saveEdit = () => {
    const cleanText = editText.trim();
    if (cleanText.length < 3) return;
    onEdit(reply.id, cleanText);
    setIsEditing(false);
  };

  return (
    <div style={{ marginLeft: `${Math.min(depth * 16, 64)}px` }}>
      <article
        className={`mt-3 rounded-lg border p-3 ${
          isAccepted
            ? "border-emerald-500/45 bg-emerald-500/10"
            : "border-white/8 bg-white/3"
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white/55">
            {hasChildren && (
              <button
                onClick={() => onToggleCollapse(reply.id)}
                className="rounded p-0.5 text-white/55 transition-colors hover:bg-white/7 hover:text-white"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
            <span className="font-medium text-white/80">{reply.author.name}</span>
            {reply.parentAuthorName && (
              <span className="text-white/40">replied to @{reply.parentAuthorName}</span>
            )}
            <span>•</span>
            <span>{new Date(reply.createdAt).toLocaleString()}</span>
            {isAccepted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                Accepted
              </span>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              rows={3}
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              className="w-full rounded-md border border-white/10 bg-[#15151f] px-2.5 py-2 text-sm text-white focus:border-sky-500/50 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-400"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(reply.body);
                }}
                className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
            {reply.isDeleted ? "This reply was removed." : reply.body}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-[#14141d] px-1.5 py-1">
            <button
              onClick={() => onVote(reply.id, 1)}
              className={`rounded p-0.5 transition-colors ${
                reply.votes.userVote === 1 ? "text-sky-300" : "text-white/45 hover:text-white"
              }`}
              aria-label="Upvote reply"
            >
              <ArrowBigUp className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-white">{score}</span>
            <button
              onClick={() => onVote(reply.id, -1)}
              className={`rounded p-0.5 transition-colors ${
                reply.votes.userVote === -1 ? "text-rose-300" : "text-white/45 hover:text-white"
              }`}
              aria-label="Downvote reply"
            >
              <ArrowBigDown className="h-4 w-4" />
            </button>
          </div>

          {!questionLocked && !reply.isDeleted && (
            <button
              onClick={() => setShowReplyForm((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-xs text-white/70 transition-all hover:border-white/14 hover:text-white"
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </button>
          )}

          {!reply.isDeleted && isQuestionAuthor && !questionLocked && (
            <button
              onClick={() => onMarkAccepted(reply.id)}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200 transition-colors hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isAccepted ? "Accepted" : "Mark solution"}
            </button>
          )}

          {!reply.isDeleted && canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-xs text-white/70 transition-all hover:border-white/14 hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          )}

          {!reply.isDeleted && canDelete && (
            <button
              onClick={() => onDelete(reply.id)}
              className="inline-flex items-center gap-1 rounded-md border border-rose-500/35 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-200 transition-colors hover:bg-rose-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}

          {!reply.isDeleted && (
            <button
              onClick={() => onReport(reply.id)}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-xs text-white/60 transition-all hover:border-rose-400/40 hover:text-rose-200"
            >
              <Flag className="h-3.5 w-3.5" />
              Report
            </button>
          )}
        </div>

        {showReplyForm && !questionLocked && (
          <div className="mt-3 space-y-2 rounded-md border border-white/10 bg-[#151521] p-3">
            <textarea
              rows={3}
              value={replyText}
              onChange={(event) => {
                setReplyText(event.target.value);
                if (replyError) setReplyError("");
              }}
              placeholder="Write your reply..."
              className="w-full rounded-md border border-white/10 bg-[#101018] px-2.5 py-2 text-sm text-white focus:border-sky-500/50 focus:outline-none"
            />
            {replyError && (
              <p className="text-xs text-rose-300">{replyError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={submitReply}
                disabled={isReplying}
                className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isReplying ? "Posting..." : "Post reply"}
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyError("");
                }}
                className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </article>

      {hasChildren && !isCollapsed && (
        <div className="border-l border-white/7 pl-3">
          {reply.children.map((child) => (
            <ThreadReplyNode
              key={child.id}
              reply={child}
              depth={depth + 1}
              acceptedReplyId={acceptedReplyId}
              currentUserId={currentUserId}
              canModerate={canModerate}
              isQuestionAuthor={isQuestionAuthor}
              questionLocked={questionLocked}
              collapsedReplyIds={collapsedReplyIds}
              onToggleCollapse={onToggleCollapse}
              onVote={onVote}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReport={onReport}
              onMarkAccepted={onMarkAccepted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreadReplyNode;

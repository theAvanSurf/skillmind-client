import type { GenreType } from "@/types/resource.types";

export type UserRole = "student" | "mentor" | "moderator" | "admin";

export type VoteValue = -1 | 0 | 1;

export type ThreadSortBy =
  | "most-upvoted"
  | "most-recent"
  | "oldest"
  | "most-discussed";

export type QuestionStatus = "open" | "solved" | "locked" | "archived";

export type NotificationType =
  | "reply_question"
  | "reply_comment"
  | "accepted_answer";

export interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
}

export interface LinkedContext {
  courseId?: string;
  courseName?: string;
  seasonId?: string;
  seasonName?: string;
  exerciseId?: string;
  exerciseName?: string;
  genre?: GenreType;
}

export interface VoteInfo {
  upvotes: number;
  downvotes: number;
  userVote: VoteValue;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  description: string;
  tags: string[];
  context: LinkedContext;
  author: CommunityUser;
  status: QuestionStatus;
  votes: VoteInfo;
  repliesCount: number;
  views: number;
  reports: number;
  isLocked: boolean;
  acceptedReplyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityReply {
  id: string;
  questionId: string;
  parentReplyId?: string;
  parentAuthorName?: string;
  body: string;
  author: CommunityUser;
  votes: VoteInfo;
  reports: number;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface ThreadedReply extends CommunityReply {
  children: ThreadedReply[];
}

export interface CommunityFilters {
  search: string;
  courseId: string;
  exerciseId: string;
  tag: string;
  genre: GenreType | "";
  sortBy: ThreadSortBy;
}

export interface CommunityCourse {
  id: string;
  name: string;
  genre: GenreType;
}

export interface CommunityExercise {
  id: string;
  courseId: string;
  name: string;
}

export interface CommunityNotification {
  id: string;
  type: NotificationType;
  questionId: string;
  replyId?: string;
  actorName: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateQuestionDTO {
  title: string;
  description: string;
  courseId?: string;
  seasonId?: string;
  exerciseId?: string;
  genre?: GenreType;
  tags?: string[];
}

export interface CreateReplyDTO {
  questionId: string;
  parentReplyId?: string;
  body: string;
}

export interface VoteDTO {
  targetId: string;
  targetType: "question" | "reply";
  vote: VoteValue;
}

import { useCallback, useEffect, useState } from "react";
import { communityServices } from "@/features/community/services/community-services";
import type {
  CommunityFilters,
  CommunityNotification,
  CommunityQuestion,
  CommunityReply,
  CreateQuestionDTO,
  CreateReplyDTO,
  ThreadSortBy,
} from "@/types/community.types";

export const useCommunityQuestions = (filters?: Partial<CommunityFilters>) => {
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await communityServices.getQuestions(filters);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
  };
};

export const useCommunityThread = (
  questionId: string,
  sortBy: ThreadSortBy = "most-upvoted"
) => {
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchThread = useCallback(async () => {
    if (!questionId) {
      setReplies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await communityServices.getThreadReplies(questionId, sortBy);
      setReplies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load thread.");
    } finally {
      setLoading(false);
    }
  }, [questionId, sortBy]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  return {
    replies,
    loading,
    error,
    refetch: fetchThread,
  };
};

export const useCreateQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createQuestion = useCallback(async (payload: CreateQuestionDTO) => {
    setLoading(true);
    setError("");

    try {
      return await communityServices.createQuestion(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create question.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createQuestion,
    loading,
    error,
  };
};

export const useCreateReply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createReply = useCallback(async (payload: CreateReplyDTO) => {
    setLoading(true);
    setError("");

    try {
      return await communityServices.createReply(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reply.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createReply,
    loading,
    error,
  };
};

export const useCommunityNotifications = () => {
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await communityServices.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    await communityServices.markNotificationAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await communityServices.markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

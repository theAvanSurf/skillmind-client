import httpClient from "@/configurations/httpClient";
import type {
  CommunityFilters,
  CommunityNotification,
  CommunityQuestion,
  CommunityReply,
  CreateQuestionDTO,
  CreateReplyDTO,
  ThreadSortBy,
  VoteDTO,
} from "@/types/community.types";

const COMMUNITY_ENDPOINT = "/api/community";

export const communityServices = {
  async getQuestions(filters?: Partial<CommunityFilters>): Promise<CommunityQuestion[]> {
    const params = new URLSearchParams();

    if (filters?.search) params.set("search", filters.search);
    if (filters?.courseId) params.set("courseId", filters.courseId);
    if (filters?.exerciseId) params.set("exerciseId", filters.exerciseId);
    if (filters?.tag) params.set("tag", filters.tag);
    if (filters?.genre) params.set("genre", filters.genre);
    if (filters?.sortBy) params.set("sortBy", filters.sortBy);

    const query = params.toString();
    const response = await httpClient.get<CommunityQuestion[]>(
      `${COMMUNITY_ENDPOINT}/questions${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  async getQuestionById(questionId: string): Promise<CommunityQuestion> {
    const response = await httpClient.get<CommunityQuestion>(
      `${COMMUNITY_ENDPOINT}/questions/${questionId}`
    );
    return response.data;
  },

  async getThreadReplies(
    questionId: string,
    sortBy: ThreadSortBy,
    page = 1,
    limit = 25
  ): Promise<CommunityReply[]> {
    const params = new URLSearchParams({
      sortBy,
      page: String(page),
      limit: String(limit),
    });

    const response = await httpClient.get<CommunityReply[]>(
      `${COMMUNITY_ENDPOINT}/questions/${questionId}/replies?${params.toString()}`
    );
    return response.data;
  },

  async createQuestion(payload: CreateQuestionDTO): Promise<CommunityQuestion> {
    const response = await httpClient.post<CommunityQuestion>(
      `${COMMUNITY_ENDPOINT}/questions`,
      payload
    );
    return response.data;
  },

  async editQuestion(
    questionId: string,
    payload: Partial<CreateQuestionDTO>
  ): Promise<CommunityQuestion> {
    const response = await httpClient.patch<CommunityQuestion>(
      `${COMMUNITY_ENDPOINT}/questions/${questionId}`,
      payload
    );
    return response.data;
  },

  async deleteQuestion(questionId: string): Promise<void> {
    await httpClient.delete(`${COMMUNITY_ENDPOINT}/questions/${questionId}`);
  },

  async toggleThreadLock(questionId: string, lock: boolean): Promise<CommunityQuestion> {
    const response = await httpClient.post<CommunityQuestion>(
      `${COMMUNITY_ENDPOINT}/questions/${questionId}/lock`,
      { lock }
    );
    return response.data;
  },

  async createReply(payload: CreateReplyDTO): Promise<CommunityReply> {
    const response = await httpClient.post<CommunityReply>(
      `${COMMUNITY_ENDPOINT}/questions/${payload.questionId}/replies`,
      payload
    );
    return response.data;
  },

  async editReply(replyId: string, body: string): Promise<CommunityReply> {
    const response = await httpClient.patch<CommunityReply>(
      `${COMMUNITY_ENDPOINT}/replies/${replyId}`,
      { body }
    );
    return response.data;
  },

  async deleteReply(replyId: string): Promise<void> {
    await httpClient.delete(`${COMMUNITY_ENDPOINT}/replies/${replyId}`);
  },

  async vote(payload: VoteDTO): Promise<void> {
    await httpClient.post(`${COMMUNITY_ENDPOINT}/votes`, payload);
  },

  async markAccepted(questionId: string, replyId: string): Promise<CommunityQuestion> {
    const response = await httpClient.post<CommunityQuestion>(
      `${COMMUNITY_ENDPOINT}/questions/${questionId}/accepted-answer`,
      { replyId }
    );
    return response.data;
  },

  async reportContent(targetType: "question" | "reply", targetId: string): Promise<void> {
    await httpClient.post(`${COMMUNITY_ENDPOINT}/reports`, {
      targetType,
      targetId,
    });
  },

  async getNotifications(): Promise<CommunityNotification[]> {
    const response = await httpClient.get<CommunityNotification[]>(
      `${COMMUNITY_ENDPOINT}/notifications`
    );
    return response.data;
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await httpClient.post(
      `${COMMUNITY_ENDPOINT}/notifications/${notificationId}/read`
    );
  },

  async markAllNotificationsAsRead(): Promise<void> {
    await httpClient.post(`${COMMUNITY_ENDPOINT}/notifications/read-all`);
  },
};

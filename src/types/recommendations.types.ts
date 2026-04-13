export type TrackEventType = "started" | "completed" | "paused" | "clicked" | "searched";

export interface TrackEventRequest {
    course_id: string;
    event_type: TrackEventType;
    category?: string;
    tags?: string;
    search_query?: string;
    engagement_seconds?: number;
}

export interface RecommendedCourse {
    id: string;
    title: string;
    thumbnail_url: string;
    category?: string;
    tags?: string;
    relevance_score: number;
    reason?: string;
}

export interface RecommendationResponse {
    profile_id: string;
    is_personalized: boolean;
    recommendations: RecommendedCourse[];
}

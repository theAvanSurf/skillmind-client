export interface LessonDto {
    id: string;
    seasonId: string;
    title: string;
    videoUrl: string;
    description?: string;
    order: number;
    durationSeconds: number;
}

export interface SeasonDto {
    id: string;
    courseId: string;
    title: string;
    order: number;
    lessons: LessonDto[];
}

export interface CourseDto {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    category?: string;
    tags?: string;
    seasons: SeasonDto[];
}

export interface CourseCardDto {
    id: string;
    title: string;
    thumbnailUrl: string;
    category?: string;
    progressPercent?: number;
}

export interface UpdateProgressDto {
    lastLessonId: string;
    progressPercent: number;
}

// ── Browse / Search ───────────────────────────────────────────────────────────

export interface BrowseCourseDto {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    category?: string;
    tags?: string;
    price: number;
    totalSeasons: number;
    totalLessons: number;
    createdOn: string;
}

export interface BrowseCoursesResult {
    courses: BrowseCourseDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface CourseSuggestion {
    text: string;
    type: 'course' | 'category' | 'tag';
    courseId?: string;
}

export interface BrowseCoursesQuery {
    search?: string;
    category?: string;
    freeOnly?: boolean;
    page?: number;
    pageSize?: number;
    sort?: 'newest' | 'oldest' | 'free' | 'paid';
}
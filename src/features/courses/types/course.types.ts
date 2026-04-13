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
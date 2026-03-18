export type ResourceType = 'PDF' | 'Video' | 'Exercise';
export type ResourceStatus = 'Draft' | 'Published' | 'Archived';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type GenreType = 
  | 'Programming' 
  | 'Music' 
  | 'Audio Engineering' 
  | 'Business' 
  | 'Languages'
  | 'Design'
  | 'Marketing'
  | 'Science'
  | 'Mathematics'
  | 'Arts';

export type QuestionType = 'Multiple Choice' | 'Open-Ended' | 'True/False';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer?: string | boolean; // For auto-grading
  explanation?: string;
}

export interface Exercise {
  questions: Question[];
  totalPoints?: number;
  timeLimit?: number; // in minutes
  passingScore?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  genre: GenreType[];
  resourceType: ResourceType;
  tags?: string[];
  difficultyLevel?: DifficultyLevel;
  status: ResourceStatus;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  
  // File related
  fileUrl?: string;
  fileName?: string;
  fileSize?: number; // in bytes
  thumbnailUrl?: string;
  
  // Video specific (YouTube)
  youtubeUrl?: string;
  videoDuration?: string;
  
  // Exercise specific
  exercise?: Exercise;
  
  // Metadata
  views: number;
  downloads: number;
  rating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ResourceFilters {
  genres?: GenreType[];
  resourceTypes?: ResourceType[];
  difficultyLevels?: DifficultyLevel[];
  search?: string;
  authorId?: string;
  status?: ResourceStatus;
}

export interface ResourceSortOption {
  value: string;
  label: string;
}

export type SortBy = 'recent' | 'views' | 'downloads' | 'rating' | 'title';

export interface CreateResourceDTO {
  title: string;
  description: string;
  genre: GenreType[];
  resourceType: ResourceType;
  tags?: string[];
  difficultyLevel?: DifficultyLevel;
  status?: ResourceStatus;
  
  // For PDF
  file?: File;
  
  // For Video (YouTube URL)
  youtubeUrl?: string;
  
  // For Exercise
  exercise?: Exercise;
}

export interface UpdateResourceDTO extends Partial<CreateResourceDTO> {
  id: string;
}

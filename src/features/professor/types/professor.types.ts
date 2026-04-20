// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfessorProfile {
  id: string
  userId: string
  bio: string
  expertise: string | null
  yearsOfExperience: number
  linkedInUrl: string | null
  profilePhotoUrl: string | null
  payoutStatus: string
  hasStripeConnect: boolean
  hasYouTubeOAuth: boolean
  createdOn: string
}

export interface UpdateProfessorProfileRequest {
  bio?: string
  expertise?: string
  yearsOfExperience?: number
  linkedInUrl?: string
  profilePhotoUrl?: string
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface CourseEngagement {
  courseId: string
  title: string
  thumbnailUrl: string
  enrolledStudents: number
  averageProgress: number
  price: number
  revenue: number
}

export interface ProfessorDashboard {
  totalCourses: number
  totalStudents: number
  activeStudents: number
  totalEarnings: number
  earningsThisMonth: number
  courseCompletionRate: number
  pendingExamReviews: number
  certificatesIssued: number
  courses: CourseEngagement[]
}

// ── Earnings ──────────────────────────────────────────────────────────────────

export interface MonthlyEarning {
  year: number
  month: number
  monthName: string
  amount: number
}

export interface CourseEarning {
  courseId: string
  courseTitle: string
  revenue: number
  enrollmentCount: number
}

export interface EarningsSummary {
  totalEarnings: number
  pendingPayout: number
  monthly: MonthlyEarning[]
  byCourse: CourseEarning[]
}

// ── Students ──────────────────────────────────────────────────────────────────

export interface EnrolledStudent {
  enrollmentId: string
  studentProfileId: string
  studentName: string
  courseTitle: string
  courseId: string
  paidAmount: number
  enrolledAt: string
  completedAt: string | null
}

// ── Stripe Connect ────────────────────────────────────────────────────────────

export interface StripeConnectStatus {
  payoutStatus: string
  chargesEnabled: boolean
  payoutsEnabled: boolean
  stripeAccountId: string | null
}

// ── Courses ───────────────────────────────────────────────────────────────────

// Matches backend GlobalStatus enum: Active (default), Inactive, Verified (published)
export type CourseStatus = "Active" | "Inactive" | "Verified"

export interface Season {
  id: string
  courseId: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  seasonId: string
  title: string
  description: string | null
  videoUrl: string | null
  durationSeconds: number
  order: number
}

export interface Course {
  id: string
  professorId: string
  title: string
  description: string
  thumbnailUrl: string | null
  category: string | null
  tags: string | null
  price: number
  status: CourseStatus
  createdOn: string
  seasons: Season[]
}

export interface CreateCourseRequest {
  title: string
  description: string
  thumbnailUrl?: string
  category?: string
  tags?: string
  price: number
}

export interface UpdateCourseRequest {
  title?: string
  description?: string
  thumbnailUrl?: string
  category?: string
  tags?: string
  price?: number
}

export interface CreateSeasonRequest {
  courseId: string
  title: string
  order: number
}

export interface CreateLessonRequest {
  seasonId: string
  title: string
  description?: string
  videoUrl?: string
  durationSeconds?: number
  order: number
}

// ── Exams ─────────────────────────────────────────────────────────────────────

export type QuestionType = "MultipleChoice" | "TrueFalse" | "OpenText"

export interface QuestionOption {
  id: string
  questionId: string
  optionText: string
  isCorrect: boolean
}

export interface ExamQuestion {
  id: string
  examId: string
  questionText: string
  questionType: QuestionType
  points: number
  order: number
  options: QuestionOption[]
}

export interface Exam {
  id: string
  courseId: string
  title: string
  description: string | null
  durationMinutes: number | null
  passingScore: number
  status: string
  questionCount: number
  questions: ExamQuestion[]
}

export interface CreateExamRequest {
  courseId: string
  title: string
  description?: string
  durationMinutes?: number
  passingScore: number
}

export interface CreateExamQuestionRequest {
  examId: string
  questionText: string
  questionType: QuestionType
  points: number
  order: number
  options: { optionText: string; isCorrect: boolean }[]
}

export interface ExamAttempt {
  id: string
  examId: string
  studentProfileId: string
  studentName: string
  score: number | null
  passed: boolean | null
  completedAt: string | null
  answers: {
    questionId: string
    questionText: string
    questionType: QuestionType
    selectedOptionId: string | null
    openTextAnswer: string | null
    isCorrect: boolean | null
    pointsAwarded: number
  }[]
}

// ── Certificates ──────────────────────────────────────────────────────────────

export interface CertificateTemplate {
  id: string
  professorId: string
  courseId: string | null
  title: string
  templateKey: string
  signatureImageUrl: string | null
  isDefault: boolean
  createdOn: string
}

export interface Certificate {
  id: string
  studentProfileId: string
  courseId: string
  courseTitle: string
  studentName: string
  templateId: string
  templateKey: string
  uniqueCode: string
  isManuallyIssued: boolean
  issuedAt: string
}

// ── Live Streaming ─────────────────────────────────────────────────────────────

export interface LiveSession {
  id: string
  courseId: string
  courseTitle: string
  title: string
  description: string | null
  embedUrl: string | null
  youTubeBroadcastId: string | null
  visibility: string
  status: "Scheduled" | "Live" | "Ended" | "Cancelled"
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  createdOn: string
}

export interface LiveSessionCreated extends LiveSession {
  streamKey: string | null
  rtmpIngestUrl: string | null
}

export interface CreateLiveSessionRequest {
  courseId: string
  title: string
  description?: string
  visibility?: "Public" | "Unlisted" | "Private"
  scheduledAt?: string
}

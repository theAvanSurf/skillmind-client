// Professor Dashboard Types

export type ProfessorRole = "professor";

export interface Professor {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalStudentsEnrolled: number;
  activeStudents: number;
  courseCompletionRate: number; // 0-100
  totalEarnings: number;
  pendingPayouts: number;
  upcomingLiveSessions?: number;
  lastUpdated: string;
}

// Grades
export type GradeStatus = "completed" | "pending" | "grading";

export type ExamType = "multiple_choice" | "essay" | "mixed" | "practice";

export interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  examId: string;
  examName: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: GradeStatus;
  isAutoGraded: boolean;
  publishedAt?: string;
  submittedAt: string;
  feedback?: string;
  questions?: GradeQuestion[];
}

export interface GradeQuestion {
  id: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer?: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
}

export interface GradeFilter {
  courseId?: string;
  studentId?: string;
  examId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: GradeStatus[];
}

// Earnings & Payouts
export interface EarningsBreakdown {
  totalEarnings: number;
  perCourse: Record<string, number>; // courseId -> amount
  netAmount: number;
  platformFees: number;
  totalPayouts: number;
  pendingAmount: number;
}

export type PayoutStatus = "paid" | "processing" | "pending" | "failed";

export interface Payout {
  id: string;
  amount: number;
  status: PayoutStatus;
  date: string;
  dueDate?: string;
  method?: "bank_transfer" | "stripe" | "paypal";
  transactionId?: string;
  failureReason?: string;
}

export interface PayoutHistory {
  payouts: Payout[];
  totalPaid: number;
  totalPending: number;
  nextPayoutDate?: string;
}

// Certifications
export interface CertificateTemplate {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  logoUrl?: string;
  signatureUrl?: string;
  completionCriteria: {
    minCompletionPercentage: number;
    minGradePercentage?: number;
    requiredAssignments?: number;
  };
  customFields?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface IssuedCertificate {
  id: string;
  templateId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  completionDate: string;
  certificateUrl?: string;
  issuedDate: string;
  expiryDate?: string;
  verificationCode: string;
}

// Engagement Analytics
export interface EngagementMetrics {
  courseId: string;
  courseName: string;
  averageWatchTime: number; // minutes
  completionRate: number; // 0-100
  dropOffPoints: DropOffPoint[];
  mostReWatchedSections: ReWatchedSection[];
  exerciseParticipationRate: number; // 0-100
  questionActivityCount: number;
  activeStudentCount: number;
  totalStudentCount: number;
}

export interface DropOffPoint {
  lessonId: string;
  lessonTitle: string;
  dropoffPercentage: number; // % of students who stopped
  position: number; // Lesson index
}

export interface ReWatchedSection {
  sectionId: string;
  sectionTitle: string;
  reWatchCount: number;
  averageReWatchTime: number; // minutes
}

// Exams & Assessments
export interface ExamOverview {
  examId: string;
  examName: string;
  courseId: string;
  courseName: string;
  type: ExamType;
  totalAttempts: number;
  passCount: number;
  failCount: number;
  passRate: number; // 0-100
  averageScore: number;
  medianScore: number;
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  score?: number;
  maxScore: number;
  percentage?: number;
  status: "submitted" | "graded" | "pending_review";
  answers: ExamAnswer[];
  professorFeedback?: string;
}

export interface ExamAnswer {
  questionId: string;
  questionText: string;
  questionType: "mcq" | "short_answer" | "essay" | "code";
  studentAnswer: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  points?: number;
  maxPoints: number;
  autoGradedAt?: string;
}

// Alerts & Notifications
export type AlertType = "unreviewed_exam" | "pending_publication" | "certification" | "failed_payout" | "low_engagement";

export interface DashboardAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  readAt?: string;
}

// Dashboard State
export interface ProfessorDashboardState {
  summary: DashboardSummary | null;
  alerts: DashboardAlert[];
  loading: boolean;
  error: string | null;
}

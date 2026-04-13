import type {
  StudentGrade,
  GradeFilter,
  EarningsBreakdown,
  PayoutHistory,
  EngagementMetrics,
  ExamOverview,
  ExamSubmission,
  DashboardAlert,
  DashboardSummary,
  CertificateTemplate,
  IssuedCertificate,
} from "@/types/professor.types";
import {
  mockStudentGrades,
  mockEarningsBreakdown,
  mockPayoutHistory,
  mockEngagementMetrics,
  mockExamOverviews,
  mockAlerts,
} from "@/types/professor.mock-data";

// ─── Grades Service ────────────────────────────────────────────────────────

export async function fetchStudentGrades(filter?: GradeFilter): Promise<StudentGrade[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  let result = [...mockStudentGrades];

  if (filter) {
    if (filter.courseId) {
      result = result.filter((g) => g.courseId === filter.courseId);
    }
    if (filter.studentId) {
      result = result.filter((g) => g.studentId === filter.studentId);
    }
    if (filter.examId) {
      result = result.filter((g) => g.examId === filter.examId);
    }
    if (filter.status && filter.status.length > 0) {
      result = result.filter((g) => filter.status!.includes(g.status));
    }
    if (filter.dateFrom && filter.dateTo) {
      const from = new Date(filter.dateFrom).getTime();
      const to = new Date(filter.dateTo).getTime();
      result = result.filter((g) => {
        const submitted = new Date(g.submittedAt).getTime();
        return submitted >= from && submitted <= to;
      });
    }
  }

  return result;
}

export async function publishGrade(gradeId: string): Promise<StudentGrade | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const grade = mockStudentGrades.find((g) => g.id === gradeId);
  if (!grade) return null;

  return {
    ...grade,
    status: "completed",
    publishedAt: new Date().toISOString(),
  };
}

export async function updateGrade(gradeId: string, updates: Partial<StudentGrade>): Promise<StudentGrade | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));

  const grade = mockStudentGrades.find((g) => g.id === gradeId);
  if (!grade) return null;

  return {
    ...grade,
    ...updates,
  };
}

// ─── Earnings Service ──────────────────────────────────────────────────────

export async function fetchEarningsBreakdown(): Promise<EarningsBreakdown> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockEarningsBreakdown;
}

export async function fetchPayoutHistory(): Promise<PayoutHistory> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPayoutHistory;
}

// ─── Analytics Service ─────────────────────────────────────────────────────

export async function fetchEngagementMetrics(courseId?: string): Promise<EngagementMetrics[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (courseId) {
    return mockEngagementMetrics.filter((m) => m.courseId === courseId);
  }

  return mockEngagementMetrics;
}

// ─── Exams Service ────────────────────────────────────────────────────────

export async function fetchExamOverviews(): Promise<ExamOverview[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockExamOverviews;
}

export async function fetchExamSubmissions(examId: string): Promise<ExamSubmission[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Return mock submissions based on exam
  return [
    {
      id: "submission-001",
      examId,
      studentId: "student-001",
      studentName: "Alex Johnson",
      submittedAt: "2024-03-17T15:30:00Z",
      score: 85,
      maxScore: 100,
      percentage: 85,
      status: "graded",
      answers: [
        {
          questionId: "q1",
          questionText: "What does React.memo do?",
          questionType: "mcq",
          studentAnswer: "Prevents unnecessary re-renders",
          correctAnswer: "Prevents unnecessary re-renders",
          isCorrect: true,
          points: 10,
          maxPoints: 10,
          autoGradedAt: "2024-03-17T15:35:00Z",
        },
      ],
      professorFeedback: "Great work!",
    },
  ];
}

export async function submitGradeForNonAutoGradedExam(
  submissionId: string,
  score: number,
  feedback: string
): Promise<boolean> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));
  return true;
}

// ─── Alerts Service ───────────────────────────────────────────────────────

export async function fetchAlerts(): Promise<DashboardAlert[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockAlerts;
}

export async function markAlertAsRead(alertId: string): Promise<boolean> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 200));
  return true;
}

export async function dismissAlert(alertId: string): Promise<boolean> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 200));
  return true;
}

// ─── Dashboard Summary Service ─────────────────────────────────────────────

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  // Simulate API call with parallel data fetching
  await new Promise((resolve) => setTimeout(resolve, 500));

  const earnings = await fetchEarningsBreakdown();
  const payouts = await fetchPayoutHistory();

  return {
    totalStudentsEnrolled: 450,
    activeStudents: 328,
    courseCompletionRate: 76,
    totalEarnings: earnings.totalEarnings,
    pendingPayouts: payouts.totalPending,
    upcomingLiveSessions: 2,
    lastUpdated: new Date().toISOString(),
  };
}

// ─── Certificate Service ──────────────────────────────────────────────────

export async function fetchCertificateTemplates(courseId?: string): Promise<CertificateTemplate[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: "template-001",
      courseId: "course-001",
      title: "React Performance Mastery",
      description: "Certification for completing the React Performance course",
      logoUrl: "https://images.unsplash.com/photo-1599507593326-63c7fbbdf0ae?w=200&h=200&fit=crop",
      signatureUrl: "https://via.placeholder.com/300x100?text=Signature",
      completionCriteria: {
        minCompletionPercentage: 80,
        minGradePercentage: 70,
      },
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-03-01T00:00:00Z",
    },
  ];
}

export async function createCertificateTemplate(
  courseId: string,
  template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">
): Promise<CertificateTemplate> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));

  const newTemplate: CertificateTemplate = {
    ...template,
    id: `template-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return newTemplate;
}

export async function issueCertificateManually(
  templateId: string,
  studentId: string,
  studentName: string
): Promise<IssuedCertificate> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400));

  const now = new Date().toISOString();
  return {
    id: `cert-${Date.now()}`,
    templateId,
    studentId,
    studentName,
    courseId: "course-001",
    courseName: "React Performance Mastery",
    completionDate: now,
    issuedDate: now,
    certificateUrl: `https://certificates.skillmind.com/cert-${Date.now()}.pdf`,
    verificationCode: `VERIFY-${Date.now()}`,
  };
}

export async function fetchIssuedCertificates(courseId?: string): Promise<IssuedCertificate[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: "cert-001",
      templateId: "template-001",
      studentId: "student-001",
      studentName: "Alex Johnson",
      courseId: "course-001",
      courseName: "React Performance Mastery",
      completionDate: "2024-03-15T00:00:00Z",
      issuedDate: "2024-03-15T10:00:00Z",
      certificateUrl: "https://certificates.skillmind.com/cert-001.pdf",
      verificationCode: "VERIFY-CERT-001",
    },
  ];
}

export async function validareAndAutoIssueCertificates(courseId: string): Promise<number> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In real implementation, would check completion criteria against actual data
  // For now, return mock count of newly issued certificates
  return 5;
}

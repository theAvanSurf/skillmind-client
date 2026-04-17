import axios from "axios"
import type {
  ProfessorProfile,
  ProfessorDashboard,
  EarningsSummary,
  EnrolledStudent,
  StripeConnectStatus,
  UpdateProfessorProfileRequest,
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateSeasonRequest,
  Season,
  CreateLessonRequest,
  Lesson,
  Exam,
  CreateExamRequest,
  CreateExamQuestionRequest,
  ExamAttempt,
  CertificateTemplate,
  Certificate,
  LiveSession,
  LiveSessionCreated,
  CreateLiveSessionRequest,
} from "../types/professor.types"

const api = axios.create({ baseURL: "/api/professor" })

// Attach auth token from Zustand store on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("create-user-storage")
      const token = raw ? JSON.parse(raw)?.state?.token : null
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // ignore parse errors
    }
  }
  return config
})

// Handle 401 Unauthorized globally for professor services
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        fetch("/api/sessions/select-profile", { method: "DELETE" }).finally(() => {
          window.location.href = "/login";
        });
      }
    }
    return Promise.reject(error);
  }
)

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getMyProfile(): Promise<ProfessorProfile> {
  const { data } = await api.get<ProfessorProfile>("/profile")
  return data
}

export async function updateMyProfile(req: UpdateProfessorProfileRequest): Promise<ProfessorProfile> {
  const { data } = await api.put<ProfessorProfile>("/profile", req)
  return data
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getDashboard(): Promise<ProfessorDashboard> {
  const { data } = await api.get<ProfessorDashboard>("/dashboard")
  return data
}

export async function getEarnings(): Promise<EarningsSummary> {
  const { data } = await api.get<EarningsSummary>("/earnings")
  return data
}

export async function getEnrolledStudents(): Promise<EnrolledStudent[]> {
  const { data } = await api.get<EnrolledStudent[]>("/students")
  return data
}

// ── Stripe Connect ────────────────────────────────────────────────────────────

export async function getStripeStatus(): Promise<StripeConnectStatus> {
  const { data } = await api.get<StripeConnectStatus>("/stripe/status")
  return data
}

export async function createStripeConnect(returnUrl: string): Promise<{ onboardingUrl: string }> {
  const { data } = await api.post<{ onboardingUrl: string }>("/stripe/connect", null, {
    params: { returnUrl },
  })
  return data
}

// ── Courses ───────────────────────────────────────────────────────────────────

export async function getMyCourses(): Promise<Course[]> {
  const { data } = await api.get<Course[]>("/courses")
  return data
}

export async function getCourse(id: string): Promise<Course> {
  const { data } = await api.get<Course>(`/courses/${id}`)
  return data
}

export async function createCourse(req: CreateCourseRequest): Promise<Course> {
  const { data } = await api.post<Course>("/courses", req)
  return data
}

export async function updateCourse(id: string, req: UpdateCourseRequest): Promise<Course> {
  const { data } = await api.put<Course>(`/courses/${id}`, req)
  return data
}

export async function publishCourse(id: string): Promise<void> {
  await api.post(`/courses/${id}/publish`)
}

export async function createSeason(req: CreateSeasonRequest): Promise<Season> {
  const { data } = await api.post<Season>("/seasons", req)
  return data
}

export async function createLesson(req: CreateLessonRequest): Promise<Lesson> {
  const { data } = await api.post<Lesson>("/lessons", req)
  return data
}

// ── Exams ─────────────────────────────────────────────────────────────────────

export async function getExamsByCourse(courseId: string): Promise<Exam[]> {
  const { data } = await api.get<Exam[]>(`/exams/course/${courseId}`)
  return data
}

export async function getExam(examId: string): Promise<Exam> {
  const { data } = await api.get<Exam>(`/exams/${examId}`)
  return data
}

export async function createExam(req: CreateExamRequest): Promise<Exam> {
  const { data } = await api.post<Exam>("/exams", req)
  return data
}

export async function addQuestion(examId: string, req: Omit<CreateExamQuestionRequest, "examId">): Promise<Exam> {
  const { data } = await api.post<Exam>(`/exams/${examId}/questions`, req)
  return data
}

export async function publishExam(examId: string): Promise<void> {
  await api.post(`/exams/${examId}/publish`)
}

export async function getExamAttempts(examId: string): Promise<ExamAttempt[]> {
  const { data } = await api.get<ExamAttempt[]>(`/exams/${examId}/attempts`)
  return data
}

export async function gradeOpenText(
  attemptId: string,
  questionId: string,
  pointsAwarded: number,
  feedback?: string
): Promise<ExamAttempt> {
  const { data } = await api.post<ExamAttempt>("/exams/attempts/grade", {
    attemptId,
    questionId,
    pointsAwarded,
    feedback,
  })
  return data
}

// ── Certificate Templates ─────────────────────────────────────────────────────

export async function getCertificateTemplates(): Promise<CertificateTemplate[]> {
  const { data } = await api.get<CertificateTemplate[]>("/certificates/templates")
  return data
}

export async function createCertificateTemplate(req: {
  courseId?: string
  title: string
  bodyHtml: string
  signatureImageUrl?: string
  isDefault?: boolean
}): Promise<CertificateTemplate> {
  const { data } = await api.post<CertificateTemplate>("/certificates/templates", req)
  return data
}

export async function updateCertificateTemplate(
  templateId: string,
  req: { title?: string; bodyHtml?: string; signatureImageUrl?: string; isDefault?: boolean }
): Promise<CertificateTemplate> {
  const { data } = await api.put<CertificateTemplate>(`/certificates/templates/${templateId}`, req)
  return data
}

export async function getCertsByCourse(courseId: string): Promise<Certificate[]> {
  const { data } = await api.get<Certificate[]>(`/certificates/course/${courseId}`)
  return data
}

export async function issueCertificate(req: {
  studentProfileId: string
  courseId: string
  templateId: string
}): Promise<Certificate> {
  const { data } = await api.post<Certificate>("/certificates/issue", req)
  return data
}

// ── Live Streaming ─────────────────────────────────────────────────────────────

export async function getLiveSessions(): Promise<LiveSession[]> {
  const { data } = await api.get<LiveSession[]>("/livestreams")
  return data
}

export async function createLiveSession(req: CreateLiveSessionRequest): Promise<LiveSessionCreated> {
  const { data } = await api.post<LiveSessionCreated>("/livestreams", req)
  return data
}

export async function startLiveSession(id: string): Promise<LiveSession> {
  const { data } = await api.post<LiveSession>(`/livestreams/${id}/start`)
  return data
}

export async function endLiveSession(id: string): Promise<LiveSession> {
  const { data } = await api.post<LiveSession>(`/livestreams/${id}/end`)
  return data
}

export async function getYouTubeStatus(): Promise<{ isConnected: boolean }> {
  const { data } = await api.get<{ isConnected: boolean }>("/livestreams/youtube-status")
  return data
}

export async function getYouTubeOAuthUrl(): Promise<{ authorizationUrl: string }> {
  const { data } = await api.get<{ authorizationUrl: string }>("/livestreams/oauth/url")
  return data
}

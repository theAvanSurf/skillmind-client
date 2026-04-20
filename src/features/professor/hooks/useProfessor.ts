import { sileo } from "sileo";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as svc from "../services/professor-services"
import type {
  UpdateProfessorProfileRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateExamRequest,
  CreateExamQuestionRequest,
} from "../types/professor.types"

// ── Query keys ────────────────────────────────────────────────────────────────

export const professorKeys = {
  profile: ["professor", "profile"] as const,
  dashboard: ["professor", "dashboard"] as const,
  earnings: ["professor", "earnings"] as const,
  students: ["professor", "students"] as const,
  stripeStatus: ["professor", "stripe", "status"] as const,
  courses: ["professor", "courses"] as const,
  course: (id: string) => ["professor", "courses", id] as const,
  exams: (courseId: string) => ["professor", "exams", courseId] as const,
  exam: (id: string) => ["professor", "exam", id] as const,
  attempts: (examId: string) => ["professor", "attempts", examId] as const,
  certTemplates: ["professor", "cert-templates"] as const,
  certs: (courseId: string) => ["professor", "certs", courseId] as const,
  allCerts: ["professor", "certs", "all"] as const,
  livestreams: ["professor", "livestreams"] as const,
  youtubeStatus: ["professor", "youtube", "status"] as const,
}

// ── Profile ───────────────────────────────────────────────────────────────────

export function useProfessorProfile() {
  return useQuery({ queryKey: professorKeys.profile, queryFn: svc.getMyProfile })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: UpdateProfessorProfileRequest) => svc.updateMyProfile(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: professorKeys.profile }),
  })
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function useProfessorDashboard() {
  return useQuery({ queryKey: professorKeys.dashboard, queryFn: svc.getDashboard })
}

export function useEarnings() {
  return useQuery({ queryKey: professorKeys.earnings, queryFn: svc.getEarnings })
}

export function useEnrolledStudents() {
  return useQuery({ queryKey: professorKeys.students, queryFn: svc.getEnrolledStudents })
}

export function useStripeStatus() {
  return useQuery({ queryKey: professorKeys.stripeStatus, queryFn: svc.getStripeStatus, staleTime: 0 })
}

// ── Courses ───────────────────────────────────────────────────────────────────

export function useMyCourses() {
  return useQuery({ queryKey: professorKeys.courses, queryFn: svc.getMyCourses })
}

export function useCourse(id: string) {
  return useQuery({ queryKey: professorKeys.course(id), queryFn: () => svc.getCourse(id), enabled: !!id })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateCourseRequest) => svc.createCourse(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: professorKeys.courses }),
  })
}

export function useUpdateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateCourseRequest }) => svc.updateCourse(id, req),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: professorKeys.courses })
      qc.invalidateQueries({ queryKey: professorKeys.course(id) })
    },
  })
}


export function usePublishCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      return await sileo.promise(svc.publishCourse(id), {
        loading: { title: "Publishing course..." },
        success: { title: "Course published successfully!" },
        error: { title: "Failed to publish course" },
      });
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: professorKeys.courses })
      qc.invalidateQueries({ queryKey: professorKeys.course(id) })
    },
  })
}

// ── Exams ─────────────────────────────────────────────────────────────────────

export function useExamsByCourse(courseId: string) {
  return useQuery({
    queryKey: professorKeys.exams(courseId),
    queryFn: () => svc.getExamsByCourse(courseId),
    enabled: !!courseId,
  })
}

export function useExam(examId: string) {
  return useQuery({
    queryKey: professorKeys.exam(examId),
    queryFn: () => svc.getExam(examId),
    enabled: !!examId,
  })
}

export function useCreateExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateExamRequest) => svc.createExam(req),
    onSuccess: (data) => qc.invalidateQueries({ queryKey: professorKeys.exams(data.courseId) }),
  })
}

export function useAddQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ examId, req }: { examId: string; req: Omit<CreateExamQuestionRequest, "examId"> }) =>
      svc.addQuestion(examId, req),
    onSuccess: (data) => qc.invalidateQueries({ queryKey: professorKeys.exam(data.id) }),
  })
}

export function usePublishExam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (examId: string) => svc.publishExam(examId),
    onSuccess: (_, examId) => qc.invalidateQueries({ queryKey: professorKeys.exam(examId) }),
  })
}

export function useExamAttempts(examId: string) {
  return useQuery({
    queryKey: professorKeys.attempts(examId),
    queryFn: () => svc.getExamAttempts(examId),
    enabled: !!examId,
  })
}

export function useGradeOpenText() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      pointsAwarded,
      feedback,
    }: {
      attemptId: string
      questionId: string
      pointsAwarded: number
      feedback?: string
    }) => svc.gradeOpenText(attemptId, questionId, pointsAwarded, feedback),
    onSuccess: (data) => qc.invalidateQueries({ queryKey: professorKeys.attempts(data.examId) }),
  })
}

// ── Certificates ──────────────────────────────────────────────────────────────

export function useCertificateTemplates() {
  return useQuery({ queryKey: professorKeys.certTemplates, queryFn: svc.getCertificateTemplates })
}

export function useCertsByCourse(courseId: string) {
  return useQuery({
    queryKey: professorKeys.certs(courseId),
    queryFn: () => svc.getCertsByCourse(courseId),
    enabled: !!courseId,
  })
}

export function useAllMyCerts() {
  return useQuery({ queryKey: professorKeys.allCerts, queryFn: svc.getAllMyCerts })
}

export function useCreateCertificateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: svc.createCertificateTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: professorKeys.certTemplates }),
  })
}

export function useUpdateCertificateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      templateId,
      req,
    }: {
      templateId: string
      req: { title?: string; templateKey?: string; signatureImageUrl?: string; isDefault?: boolean }
    }) => svc.updateCertificateTemplate(templateId, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: professorKeys.certTemplates }),
  })
}

export function useIssueCertificate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: svc.issueCertificate,
    onSuccess: (data) => qc.invalidateQueries({ queryKey: professorKeys.certs(data.courseId) }),
  })
}

// ── Live Streaming ─────────────────────────────────────────────────────────────

export function useLiveSessions() {
  return useQuery({ queryKey: professorKeys.livestreams, queryFn: svc.getLiveSessions })
}

export function useYouTubeStatus() {
  return useQuery({ queryKey: professorKeys.youtubeStatus, queryFn: svc.getYouTubeStatus, staleTime: 0 })
}

export function useCreateLiveSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: svc.createLiveSession,
    onSuccess: () => qc.invalidateQueries({ queryKey: professorKeys.livestreams }),
  })
}

export function useStartLiveSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: svc.startLiveSession,
    onSuccess: () => qc.invalidateQueries({ queryKey: professorKeys.livestreams }),
  })
}

export function useEndLiveSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: svc.endLiveSession,
    onSuccess: () => qc.invalidateQueries({ queryKey: professorKeys.livestreams }),
  })
}

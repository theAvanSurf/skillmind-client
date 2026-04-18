import ExamBuilder from "@/features/professor/components/ExamBuilder"
import { Suspense } from "react"

export const metadata = { title: "Exams — SkillMind" }

export default function ProfessorExamsPage() {
  return (
    <Suspense>
      <ExamBuilder />
    </Suspense>
  )
}

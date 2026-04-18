import CertificatesPage from "@/features/professor/components/CertificatesPage"
import { Suspense } from "react"

export const metadata = { title: "Certificates — SkillMind" }

export default function ProfessorCertificatesPage() {
  return (
    <Suspense>
      <CertificatesPage />
    </Suspense>
  )
}

import { ReactNode } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfessorSidebar from "@/features/professor/components/ProfessorSidebar"

export default async function ProfessorLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  if (!token) redirect("/login")

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <ProfessorSidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}

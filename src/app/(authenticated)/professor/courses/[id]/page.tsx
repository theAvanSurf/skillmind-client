import CourseEditor from "@/features/professor/components/CourseEditor"

export const metadata = { title: "Edit Course — SkillMind" }

export default async function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CourseEditor courseId={id} />
}

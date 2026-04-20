"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Award, Pencil, Star, Loader2, CheckCircle, X, User } from "lucide-react"
import {
  useCertificateTemplates,
  useCreateCertificateTemplate,
  useUpdateCertificateTemplate,
  useAllMyCerts,
  useIssueCertificate,
  useMyCourses,
  useEnrolledStudents,
} from "../hooks/useProfessor"
import type { CertificateTemplate } from "../types/professor.types"

// ── Predefined template definitions ──────────────────────────────────────────

const TEMPLATE_OPTIONS = [
  {
    key: "classic",
    label: "Classic",
    description: "Gold border, serif fonts, timeless look",
    preview: (
      <div className="w-full h-20 bg-white rounded-lg border-2 border-yellow-400 flex flex-col items-center justify-center gap-1 p-2">
        <div className="h-1.5 w-16 bg-yellow-400 rounded" />
        <div className="h-1 w-24 bg-gray-300 rounded" />
        <div className="h-1 w-20 bg-gray-200 rounded" />
      </div>
    ),
  },
  {
    key: "modern",
    label: "Modern",
    description: "Dark with purple gradient accent panel",
    preview: (
      <div className="w-full h-20 bg-[#0f0f1a] rounded-lg overflow-hidden flex">
        <div className="w-1/3 bg-linear-to-b from-blue-600 to-purple-700" />
        <div className="flex-1 flex flex-col justify-center gap-1.5 p-3">
          <div className="h-1.5 w-16 bg-white/40 rounded" />
          <div className="h-2.5 w-20 bg-white/80 rounded" />
          <div className="h-1 w-14 bg-white/25 rounded" />
        </div>
      </div>
    ),
  },
  {
    key: "minimal",
    label: "Minimal",
    description: "Clean white, thin top bar, editorial style",
    preview: (
      <div className="w-full h-20 bg-[#fafaf8] rounded-lg overflow-hidden flex flex-col">
        <div className="h-1.5 bg-gray-900" />
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="h-1 w-24 bg-gray-300 rounded" />
          <div className="h-2 w-20 bg-gray-800 rounded" />
          <div className="h-1 w-16 bg-gray-300 rounded" />
        </div>
      </div>
    ),
  },
]

// ── Template modal ────────────────────────────────────────────────────────────

interface TemplateModalProps {
  template?: CertificateTemplate
  onClose: () => void
}

function TemplateModal({ template, onClose }: TemplateModalProps) {
  const [title, setTitle] = useState(template?.title ?? "")
  const [templateKey, setTemplateKey] = useState(template?.templateKey ?? "classic")
  const [isDefault, setIsDefault] = useState(template?.isDefault ?? false)

  const createTemplate = useCreateCertificateTemplate()
  const updateTemplate = useUpdateCertificateTemplate()
  const isPending = createTemplate.isPending || updateTemplate.isPending

  const save = async () => {
    if (template) {
      await updateTemplate.mutateAsync({ templateId: template.id, req: { title, templateKey, isDefault } })
    } else {
      await createTemplate.mutateAsync({ title, templateKey, isDefault })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#11111a] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-sm font-bold text-white">
            {template ? "Edit Template" : "New Certificate Template"}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs text-white/50">Template name</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Completion Certificate"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-white/50">Design</label>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setTemplateKey(opt.key)}
                  className={`rounded-xl border p-2 text-left transition ${templateKey === opt.key
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/8 bg-white/2 hover:border-white/20"
                    }`}
                >
                  {opt.preview}
                  <p className={`mt-2 text-xs font-semibold ${templateKey === opt.key ? "text-blue-400" : "text-white/70"}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-white/60">Set as default template</span>
          </label>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/8 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white/80"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!title.trim() || isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            {template ? "Save changes" : "Create template"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Issue certificate modal ───────────────────────────────────────────────────

function IssueModal({ courseId, onClose }: { courseId: string; onClose: () => void }) {
  const { data: students } = useEnrolledStudents()
  const { data: templates } = useCertificateTemplates()
  const issueCert = useIssueCertificate()

  const [studentId, setStudentId] = useState("")
  const [templateId, setTemplateId] = useState("")

  const courseStudents = students?.filter((s) => s.courseId === courseId) ?? []

  const submit = async () => {
    await issueCert.mutateAsync({ studentProfileId: studentId, courseId, templateId })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#11111a] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Issue Certificate</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition"><X size={18} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-white/50">Student</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            >
              <option value="">— Select student —</option>
              {courseStudents.map((s) => (
                <option key={s.studentProfileId} value={s.studentProfileId}>{s.studentName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">Template</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            >
              <option value="">— Select template —</option>
              {templates?.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/20">Cancel</button>
          <button
            onClick={submit}
            disabled={!studentId || !templateId || issueCert.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {issueCert.isPending ? <Loader2 size={14} className="animate-spin" /> : <Award size={14} />}
            Issue
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CertificatesPage() {
  const searchParams = useSearchParams()
  const preselectedCourseId = searchParams.get("courseId") ?? ""

  const { data: templates, isLoading } = useCertificateTemplates()
  const { data: courses } = useMyCourses()
  const { data: allCerts } = useAllMyCerts()

  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null | "new">(null)
  const [issuingCourseId, setIssuingCourseId] = useState<string | null>(
    preselectedCourseId || null
  )

  // Group certs by courseId
  const certsByCourse = (allCerts ?? []).reduce<Record<string, typeof allCerts>>((acc, cert) => {
    if (!acc[cert!.courseId]) acc[cert!.courseId] = []
    acc[cert!.courseId]!.push(cert)
    return acc
  }, {})

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Certificates</h1>
          <p className="mt-1 text-sm text-white/40">Manage templates and issued certificates</p>
        </div>
        <button
          onClick={() => setEditingTemplate("new")}
          className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          <Plus size={16} /> New template
        </button>
      </div>

      {/* Templates */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Templates</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
            {[...Array(2)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5" />)}
          </div>
        ) : !templates?.length ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
            <Award size={28} className="mx-auto mb-2 text-white/20" />
            <p className="text-sm text-white/35">No templates yet. Create your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/2 p-4 hover:border-white/12 transition"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <Award size={18} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                    {t.isDefault && <Star size={12} className="text-amber-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">
                    {new Date(t.createdOn).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setEditingTemplate(t)}
                  className="text-white/30 hover:text-white/60 transition"
                >
                  <Pencil size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Issued certificates — grouped by course */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Issued Certificates</h2>
        {!courses?.length ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/25">
            No courses yet
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const certs = certsByCourse[course.id] ?? []
              return (
                <div key={course.id} className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-amber-400 shrink-0" />
                      <p className="text-sm font-semibold text-white/80 truncate">{course.title}</p>
                      <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/40">
                        {certs.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setIssuingCourseId(course.id)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
                    >
                      <Plus size={11} /> Issue
                    </button>
                  </div>
                  {certs.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-white/25">No certificates issued yet</p>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {certs.map((cert) => (
                        <div key={cert!.id} className="flex items-center gap-3 px-4 py-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">
                            <User size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/75 font-medium truncate">{cert!.studentName}</p>
                            <p className="text-xs text-white/30">
                              {cert!.isManuallyIssued ? "Manual" : "Auto"} · {new Date(cert!.issuedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {editingTemplate !== null && (
        <TemplateModal
          template={editingTemplate === "new" ? undefined : editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      {issuingCourseId && (
        <IssueModal courseId={issuingCourseId} onClose={() => setIssuingCourseId(null)} />
      )}
    </div>
  )
}

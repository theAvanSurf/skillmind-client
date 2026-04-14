"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Plus,
  Award,
  Pencil,
  Star,
  Loader2,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react"
import {
  useCertificateTemplates,
  useCreateCertificateTemplate,
  useUpdateCertificateTemplate,
  useCertsByCourse,
  useIssueCertificate,
  useMyCourses,
  useEnrolledStudents,
} from "../hooks/useProfessor"
import type { CertificateTemplate } from "../types/professor.types"

const DEFAULT_BODY = `<div style="font-family: serif; text-align: center; padding: 40px;">
  <h1 style="font-size: 2rem; color: #1a1a2e;">Certificate of Completion</h1>
  <p style="margin-top: 20px; font-size: 1.1rem;">This is to certify that</p>
  <h2 style="font-size: 1.6rem; color: #3b82f6; margin: 12px 0;">{{studentName}}</h2>
  <p style="font-size: 1.1rem;">has successfully completed</p>
  <h2 style="font-size: 1.4rem; margin: 12px 0;">{{courseTitle}}</h2>
  <p style="margin-top: 24px; color: #666;">Issued on {{issuedDate}}</p>
</div>`

// ── Template editor modal ─────────────────────────────────────────────────────

interface TemplateModalProps {
  template?: CertificateTemplate
  onClose: () => void
}

function TemplateModal({ template, onClose }: TemplateModalProps) {
  const [title, setTitle] = useState(template?.title ?? "")
  const [bodyHtml, setBodyHtml] = useState(template?.bodyHtml ?? DEFAULT_BODY)
  const [isDefault, setIsDefault] = useState(template?.isDefault ?? false)
  const [preview, setPreview] = useState(false)

  const createTemplate = useCreateCertificateTemplate()
  const updateTemplate = useUpdateCertificateTemplate()

  const isPending = createTemplate.isPending || updateTemplate.isPending

  const save = async () => {
    if (template) {
      await updateTemplate.mutateAsync({ templateId: template.id, req: { title, bodyHtml, isDefault } })
    } else {
      await createTemplate.mutateAsync({ title, bodyHtml, isDefault })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#11111a] flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <h2 className="text-sm font-bold text-white">
            {template ? "Edit Template" : "New Certificate Template"}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreview((p) => !p)}
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              {preview ? "Edit" : "Preview"}
            </button>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 transition">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!preview ? (
            <>
              <div>
                <label className="mb-1 block text-xs text-white/50">Template name</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Standard Completion Certificate"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-white/50">HTML body</label>
                  <span className="text-[11px] text-white/25">Variables: {`{{studentName}}`}, {`{{courseTitle}}`}, {`{{issuedDate}}`}</span>
                </div>
                <textarea
                  value={bodyHtml}
                  onChange={(e) => setBodyHtml(e.target.value)}
                  rows={14}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/80 placeholder-white/20 outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
                />
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
            </>
          ) : (
            <div className="rounded-xl border border-white/8 bg-white overflow-hidden min-h-64">
              <iframe
                srcDoc={bodyHtml
                  .replace("{{studentName}}", "Jane Smith")
                  .replace("{{courseTitle}}", "Sample Course Title")
                  .replace("{{issuedDate}}", new Date().toLocaleDateString())}
                className="w-full h-96"
                title="Certificate preview"
              />
            </div>
          )}
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
  const [selectedCourseId, setSelectedCourseId] = useState(preselectedCourseId)
  const { data: issuedCerts } = useCertsByCourse(selectedCourseId)

  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null | "new">(null)
  const [issuing, setIssuing] = useState(false)

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
                className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 hover:border-white/12 transition"
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

      {/* Issued certificates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">Issued Certificates</h2>
          {selectedCourseId && (
            <button
              onClick={() => setIssuing(true)}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
            >
              <Plus size={12} /> Issue manually
            </button>
          )}
        </div>

        <div className="mb-3">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40"
          >
            <option value="">— Select course to view certificates —</option>
            {courses?.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {selectedCourseId && issuedCerts && (
          issuedCerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/25">
              No certificates issued for this course yet
            </div>
          ) : (
            <div className="space-y-2">
              {issuedCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
                >
                  <Award size={16} className="text-amber-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/70">Certificate #{cert.id.slice(0, 8)}</p>
                    <p className="text-xs text-white/30">{new Date(cert.issuedAt).toLocaleDateString()}</p>
                  </div>
                  {cert.certificateUrl && (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 transition"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {editingTemplate !== null && (
        <TemplateModal
          template={editingTemplate === "new" ? undefined : editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      {issuing && selectedCourseId && (
        <IssueModal courseId={selectedCourseId} onClose={() => setIssuing(false)} />
      )}
    </div>
  )
}

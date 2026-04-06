"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Plus, Shield, Download, Sparkles, Award, FileBadge2, CheckCircle2 } from "lucide-react";
import {
  fetchCertificateTemplates,
  fetchIssuedCertificates,
  validareAndAutoIssueCertificates,
} from "@/features/professor/services/professor-dashboard.service";
import type { CertificateTemplate, IssuedCertificate } from "@/types/professor.types";
import { ChartMetricStrip, compactNumber } from "@/features/professor/components/charts/ProfessorCharts";

export default function CertificationsPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [issuedCerts, setIssuedCerts] = useState<IssuedCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "issued">("templates");
  const [autoIssueInProgress, setAutoIssueInProgress] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [templatesData, certsData] = await Promise.all([
        fetchCertificateTemplates(),
        fetchIssuedCertificates(),
      ]);

      setTemplates(templatesData);
      setIssuedCerts(certsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load certifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleAutoIssueCertificates = useCallback(async () => {
    setAutoIssueInProgress(true);
    try {
      const count = await validareAndAutoIssueCertificates("course-001");
      await loadData();
      // Could show a toast notification here
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to auto-issue certificates");
    } finally {
      setAutoIssueInProgress(false);
    }
  }, [loadData]);

  const certMetrics = useMemo(
    () => [
      { label: "Templates", value: compactNumber(templates.length), tone: "bg-blue-500/10" },
      { label: "Issued", value: compactNumber(issuedCerts.length), tone: "bg-emerald-500/10" },
      {
        label: "Auto issue",
        value: autoIssueInProgress ? "Running" : "Ready",
        tone: "bg-amber-500/10",
      },
      {
        label: "Active tab",
        value: activeTab === "templates" ? "Templates" : "Issued",
        tone: "bg-violet-500/10",
      },
    ],
    [activeTab, autoIssueInProgress, issuedCerts.length, templates.length]
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-5 sm:p-8">
        <div className="h-8 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-white/8" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-white">
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 p-6">
          <div className="flex items-center gap-3 text-red-300">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Unable to load certifications</h2>
          </div>
          <p className="mt-3 text-sm text-red-100/80">{error}</p>
          <button
            onClick={() => void loadData()}
            className="mt-4 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-5 text-white sm:p-8">
      <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_24%),linear-gradient(180deg,rgba(8,12,24,0.96),rgba(5,8,16,0.92))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.38)] sm:p-8">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0,transparent_22%,transparent_78%,rgba(255,255,255,0.04)_100%)] opacity-60" />
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            <Sparkles className="h-3.5 w-3.5" />
            Certifications workspace
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Certificate templates and issuance operations</h1>
            <p className="mt-2 text-sm leading-6 text-white/65">Manage templates, issue credentials, and keep completions verifiable.</p>
          </div>

          <ChartMetricStrip items={certMetrics} />

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
              <Plus className="h-4 w-4" />
              Create Template
            </button>
            <button
              onClick={() => void handleAutoIssueCertificates()}
              disabled={autoIssueInProgress}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-blue-500/20 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/30 disabled:opacity-50"
            >
              <Shield className="h-4 w-4" />
              {autoIssueInProgress ? "Processing..." : "Auto-Issue Certificates"}
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/4 p-1">
        <button
          onClick={() => setActiveTab("templates")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "templates"
              ? "bg-blue-500/20 text-white"
              : "text-white/50 hover:text-white/70"
          }`}
        >
          Certificate Templates
        </button>
        <button
          onClick={() => setActiveTab("issued")}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === "issued"
              ? "bg-blue-500/20 text-white"
              : "text-white/50 hover:text-white/70"
          }`}
        >
          Issued Certificates ({issuedCerts.length})
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/4 p-8 text-center">
              <p className="text-white/70">No certificate templates yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {templates.map((template) => (
                <div key={template.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{template.title}</h3>
                      <p className="mt-1 text-xs text-white/50">{template.courseId}</p>
                    </div>
                    <FileBadge2 className="h-5 w-5 text-blue-400" />
                  </div>

                  {template.thumbnail && (
                    <img
                      src={template.thumbnail}
                      alt={template.title}
                      className="mb-4 h-40 w-full rounded-lg object-cover"
                    />
                  )}

                  <div className="space-y-2 text-sm text-white/70">
                    <p>
                      <span className="font-semibold text-white">Completion:</span>{" "}
                      {template.completionCriteria.minCompletionPercentage}%
                    </p>
                    {template.completionCriteria.minGradePercentage && (
                      <p>
                        <span className="font-semibold text-white">Min Grade:</span>{" "}
                        {template.completionCriteria.minGradePercentage}%
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-xl bg-blue-500/20 px-3 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/30">
                      Edit
                    </button>
                    <button className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Issued Certificates Tab */}
      {activeTab === "issued" && (
        <div className="space-y-4">
          {issuedCerts.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/4 p-8 text-center">
              <p className="text-white/70">No certificates issued yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/4 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="bg-white/5">
                    <th className="px-4 py-3 text-left font-semibold text-white">Student</th>
                    <th className="px-4 py-3 text-left font-semibold text-white">Course</th>
                    <th className="px-4 py-3 text-left font-semibold text-white">Issued Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-white">Verification Code</th>
                    <th className="px-4 py-3 text-center font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {issuedCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-white/8 transition">
                      <td className="px-4 py-3 text-white">{cert.studentName}</td>
                      <td className="px-4 py-3 text-white/80">{cert.courseName}</td>
                      <td className="px-4 py-3 text-white/80">
                        {new Date(cert.issuedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-white/50">{cert.verificationCode}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button className="rounded-xl bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/30">
                            View
                          </button>
                          <button className="rounded-xl bg-white/10 px-2 py-1 text-xs font-semibold text-white transition hover:bg-white/20">
                            <Download className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

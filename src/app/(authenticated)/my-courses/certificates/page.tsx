"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, ExternalLink, ChevronLeft, BookOpen } from "lucide-react";

interface Certificate {
  id: string;
  courseId: string;
  courseTitle?: string;
  studentName?: string;
  issuedAt: string;
  certificateUrl?: string;
  templateName?: string;
}

export default function CertificatesPage() {
  const router = useRouter();
  const [certs, setCerts] = useState<Certificate[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses/my-certificates")
      .then((r) => r.json())
      .then((d) => setCerts(Array.isArray(d) ? d : []))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/my-courses")} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition">
          <ChevronLeft size={16} /> My Courses
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-yellow-500/10 p-3">
          <Award size={24} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Certificates</h1>
          <p className="text-sm text-white/50">{certs?.length ?? 0} certificate{certs?.length !== 1 ? "s" : ""} earned</p>
        </div>
      </div>

      {!certs || certs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <Award size={40} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm font-semibold text-white/50">No certificates yet</p>
          <p className="mt-1 text-xs text-white/25">Complete course exams to earn certificates</p>
          <button
            onClick={() => router.push("/my-courses")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/18 transition"
          >
            <BookOpen size={14} /> View My Courses
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((cert) => (
            <div key={cert.id} className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 space-y-3 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5">
                <Award size={80} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="rounded-lg bg-yellow-500/15 p-2.5">
                  <Award size={20} className="text-yellow-400" />
                </div>
                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/10 p-2 hover:bg-white/18 transition text-white/60 hover:text-white"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div>
                <p className="font-bold text-white">{cert.courseTitle ?? "Course Certificate"}</p>
                {cert.templateName && <p className="text-xs text-yellow-400/70 mt-0.5">{cert.templateName}</p>}
                {cert.studentName && <p className="text-sm text-white/50 mt-1">Awarded to {cert.studentName}</p>}
              </div>
              <p className="text-xs text-white/30">
                Issued {new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

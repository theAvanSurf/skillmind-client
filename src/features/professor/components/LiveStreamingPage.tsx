"use client"

import { useState } from "react"
import { Video, Youtube, ExternalLink, Clock, Users, Plus, X, Loader2, AlertTriangle } from "lucide-react"

// This page is a placeholder for YouTube OAuth integration (Sprint 8 backend).
// Streaming sessions are managed via /professor/live-sessions API when the
// YouTube OAuth token is connected.

interface Session {
  id: string
  title: string
  scheduledAt: string
  status: "scheduled" | "live" | "ended"
  viewerCount: number
  youtubeUrl: string | null
}

const MOCK_SESSIONS: Session[] = []

export default function LiveStreamingPage() {
  const [sessions] = useState<Session[]>(MOCK_SESSIONS)
  const [showSetup, setShowSetup] = useState(false)

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Streaming</h1>
          <p className="mt-1 text-sm text-white/40">Schedule and manage live sessions for your students</p>
        </div>
        <button
          onClick={() => setShowSetup(true)}
          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <Video size={16} /> Schedule session
        </button>
      </div>

      {/* YouTube Connect banner */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
            <Youtube size={22} className="text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Connect YouTube</p>
            <p className="mt-1 text-xs text-white/45">
              Link your YouTube account to stream directly to your channel. Students will be able to join live sessions from the course page.
            </p>
          </div>
          <button className="flex shrink-0 items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
            <ExternalLink size={14} />
            Connect
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-white mb-4">How live streaming works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Connect YouTube",
              desc: "Link your YouTube account via OAuth so SkillMind can create streams on your behalf.",
            },
            {
              step: "2",
              title: "Schedule a session",
              desc: "Pick a date/time and a course. We create the YouTube Live event automatically.",
            },
            {
              step: "3",
              title: "Go live",
              desc: "Students see the embedded player inside their course page and can join the stream.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">{item.title}</p>
                <p className="mt-1 text-xs text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <Video size={36} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm font-semibold text-white/50">No sessions yet</p>
          <p className="mt-1 text-xs text-white/25">Connect YouTube and schedule your first live session</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                session.status === "live" ? "bg-red-500/15" :
                session.status === "scheduled" ? "bg-blue-500/15" : "bg-white/5"
              }`}>
                <Video size={18} className={
                  session.status === "live" ? "text-red-400" :
                  session.status === "scheduled" ? "text-blue-400" : "text-white/20"
                } />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{session.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-white/35">
                  <span className="flex items-center gap-1"><Clock size={11} /> {new Date(session.scheduledAt).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {session.viewerCount}</span>
                </div>
              </div>
              {session.status === "live" && (
                <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  LIVE
                </span>
              )}
              {session.youtubeUrl && (
                <a href={session.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition">
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {showSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#11111a] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Schedule Live Session</h3>
              <button onClick={() => setShowSetup(false)} className="text-white/30 hover:text-white/60 transition"><X size={18} /></button>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                Connect your YouTube account first to create live sessions.
              </p>
            </div>
            <button
              onClick={() => setShowSetup(false)}
              className="mt-4 w-full rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

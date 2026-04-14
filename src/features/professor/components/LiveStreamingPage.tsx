"use client"

import { useState } from "react"
import { Video, Youtube, ExternalLink, Clock, Plus, X, Loader2, AlertTriangle, Radio, CheckCircle2, Key, Copy, Check } from "lucide-react"
import { useLiveSessions, useYouTubeStatus, useCreateLiveSession, useStartLiveSession, useEndLiveSession } from "../hooks/useProfessor"
import { getMyCourses } from "../services/professor-services"
import { useQuery } from "@tanstack/react-query"
import type { CreateLiveSessionRequest } from "../types/professor.types"

function StatusBadge({ status }: { status: string }) {
  if (status === "Live") return (
    <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400 animate-pulse">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> LIVE
    </span>
  )
  if (status === "Scheduled") return (
    <span className="flex items-center gap-1.5 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-400">
      <Clock size={11} /> Scheduled
    </span>
  )
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/30">
      <CheckCircle2 size={11} /> Ended
    </span>
  )
}

function StreamKeyModal({ sessionId, title, onClose }: { sessionId: string; title: string; onClose: () => void }) {
  const [streamKey, setStreamKey] = useState<string | null>(null)
  const [rtmpUrl, setRtmpUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedRtmp, setCopiedRtmp] = useState(false)
  const [keyVisible, setKeyVisible] = useState(false)

  useState(() => {
    fetch(`/api/professor/livestreams/${sessionId}/stream-key`)
      .then(r => r.json())
      .then(d => {
        if (d.streamKey) {
          setStreamKey(d.streamKey)
          setRtmpUrl(d.rtmpIngestUrl)
        } else {
          setError(d.message ?? "Failed to load stream key")
        }
      })
      .catch(() => setError("Failed to load stream key"))
      .finally(() => setLoading(false))
  })

  const copy = (text: string, which: "key" | "rtmp") => {
    navigator.clipboard.writeText(text)
    if (which === "key") { setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000) }
    else { setCopiedRtmp(true); setTimeout(() => setCopiedRtmp(false), 2000) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11111a] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Stream Credentials</h3>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>

        <p className="text-xs text-white/40">{title}</p>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-white/40" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-xl p-3">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        )}

        {streamKey && (
          <div className="space-y-3">
            <p className="text-xs text-white/40 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
              Keep your stream key private. Never share it publicly.
            </p>

            {/* RTMP URL */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-white/50">RTMP Server URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-white/80 font-mono truncate">{rtmpUrl}</code>
                <button
                  onClick={() => copy(rtmpUrl!, "rtmp")}
                  className="shrink-0 text-white/40 hover:text-white/70 transition"
                >
                  {copiedRtmp ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Stream Key */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-white/50">Stream Key</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-white/80 font-mono truncate">
                  {keyVisible ? streamKey : "••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setKeyVisible(v => !v)}
                  className="shrink-0 text-xs text-white/40 hover:text-white/70 transition"
                >
                  {keyVisible ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => copy(streamKey, "key")}
                  className="shrink-0 text-white/40 hover:text-white/70 transition"
                >
                  {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 space-y-1.5 text-xs text-white/40">
              <p className="font-semibold text-white/60">How to go live with OBS</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open OBS → Settings → Stream</li>
                <li>Service: Custom — paste the RTMP URL above</li>
                <li>Paste your stream key</li>
                <li>Click Start Streaming in OBS</li>
                <li>Come back here and click <span className="text-red-400 font-semibold">Go Live</span></li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LiveStreamingPage() {
  const { data: sessions, isLoading: sessionsLoading } = useLiveSessions()
  const { data: youtubeStatus, isLoading: statusLoading } = useYouTubeStatus()
  const { data: courses } = useQuery({ queryKey: ["professor", "courses"], queryFn: getMyCourses })
  const createSession = useCreateLiveSession()
  const startSession = useStartLiveSession()
  const endSession = useEndLiveSession()

  const [showModal, setShowModal] = useState(false)
  const [connectingYouTube, setConnectingYouTube] = useState(false)
  const [createdStreamKey, setCreatedStreamKey] = useState<{ key: string; rtmp: string } | null>(null)
  const [streamKeyModal, setStreamKeyModal] = useState<{ sessionId: string; title: string } | null>(null)

  const [form, setForm] = useState<CreateLiveSessionRequest>({
    courseId: "",
    title: "",
    description: "",
    visibility: "Unlisted",
  })

  const isYouTubeConnected = youtubeStatus?.isConnected ?? false

  const handleConnectYouTube = async () => {
    setConnectingYouTube(true)
    try {
      const res = await fetch("/api/professor/livestreams/oauth/url")
      const { authorizationUrl } = await res.json()
      window.location.href = authorizationUrl
    } catch {
      setConnectingYouTube(false)
    }
  }

  const handleCreate = async () => {
    if (!form.courseId || !form.title) return
    try {
      const result = await createSession.mutateAsync(form)
      if (result.streamKey) {
        setCreatedStreamKey({ key: result.streamKey, rtmp: result.rtmpIngestUrl ?? "" })
      }
      setShowModal(false)
      setForm({ courseId: "", title: "", description: "", visibility: "Unlisted" })
    } catch {}
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Streaming</h1>
          <p className="mt-1 text-sm text-white/40">Schedule and manage live sessions for your students</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!isYouTubeConnected}
          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Video size={16} /> Schedule session
        </button>
      </div>

      {/* Stream key banner (shown after creating a session) */}
      {createdStreamKey && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-emerald-300">Session created! Use these in OBS to go live.</p>
            <button onClick={() => setCreatedStreamKey(null)} className="text-white/30 hover:text-white/60">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 w-20 shrink-0">RTMP URL</span>
              <code className="text-xs text-white/70 bg-black/20 px-2 py-1 rounded">{createdStreamKey.rtmp}</code>
              <button onClick={() => navigator.clipboard.writeText(createdStreamKey.rtmp)} className="text-white/40 hover:text-white/70"><Copy size={12} /></button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 w-20 shrink-0">Stream Key</span>
              <code className="text-xs text-white/70 bg-black/20 px-2 py-1 rounded font-mono">{createdStreamKey.key}</code>
              <button onClick={() => navigator.clipboard.writeText(createdStreamKey.key)} className="text-white/40 hover:text-white/70"><Copy size={12} /></button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Connect banner */}
      {!statusLoading && !isYouTubeConnected && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
              <Youtube size={22} className="text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Connect YouTube</p>
              <p className="mt-1 text-xs text-white/45">
                Link your YouTube account to stream directly to your channel.
              </p>
            </div>
            <button
              onClick={handleConnectYouTube}
              disabled={connectingYouTube}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
            >
              {connectingYouTube ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
              Connect
            </button>
          </div>
        </div>
      )}

      {isYouTubeConnected && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
          <Youtube size={18} className="text-emerald-400" />
          <p className="text-sm text-emerald-300 font-medium">YouTube account connected</p>
        </div>
      )}

      {/* Sessions list */}
      {sessionsLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : !sessions?.length ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
          <Video size={36} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm font-semibold text-white/50">No sessions yet</p>
          <p className="mt-1 text-xs text-white/25">Connect YouTube and schedule your first live session</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                session.status === "Live" ? "bg-red-500/15" :
                session.status === "Scheduled" ? "bg-blue-500/15" : "bg-white/5"
              }`}>
                <Radio size={18} className={
                  session.status === "Live" ? "text-red-400" :
                  session.status === "Scheduled" ? "text-blue-400" : "text-white/20"
                } />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{session.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-white/35">
                  <span>{session.courseTitle}</span>
                  {session.scheduledAt && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {new Date(session.scheduledAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={session.status} />
              <div className="flex items-center gap-2">
                {/* Stream key button — always visible */}
                <button
                  onClick={() => setStreamKeyModal({ sessionId: session.id, title: session.title })}
                  title="Get stream key"
                  className="rounded-lg bg-yellow-500/10 px-2.5 py-1.5 text-xs font-semibold text-yellow-400 hover:bg-yellow-500/20 transition flex items-center gap-1.5"
                >
                  <Key size={12} /> Key
                </button>

                {session.status === "Scheduled" && (
                  <button
                    onClick={() => startSession.mutate(session.id)}
                    disabled={startSession.isPending}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                  >
                    Go Live
                  </button>
                )}
                {session.status === "Live" && (
                  <button
                    onClick={() => endSession.mutate(session.id)}
                    disabled={endSession.isPending}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 disabled:opacity-60"
                  >
                    End
                  </button>
                )}
                {session.youTubeBroadcastId && (
                  <a href={`https://youtube.com/watch?v=${session.youTubeBroadcastId}`} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11111a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Schedule Live Session</h3>
              <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white/60"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Course</label>
                <select
                  value={form.courseId}
                  onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                >
                  <option value="">Select a course</option>
                  {courses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. React Hooks Deep Dive"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Visibility</label>
                  <select
                    value={form.visibility}
                    onChange={e => setForm(f => ({ ...f, visibility: e.target.value as any }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                  >
                    <option value="Unlisted">Unlisted</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Scheduled at (optional)</label>
                  <input
                    type="datetime-local"
                    onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
            </div>

            {createSession.isError && (
              <div className="flex items-center gap-2 text-xs text-red-400">
                <AlertTriangle size={14} />
                <span>{(createSession.error as any)?.message ?? "Failed to create session"}</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 hover:border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.courseId || !form.title || createSession.isPending}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {createSession.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stream key modal */}
      {streamKeyModal && (
        <StreamKeyModal
          sessionId={streamKeyModal.sessionId}
          title={streamKeyModal.title}
          onClose={() => setStreamKeyModal(null)}
        />
      )}
    </div>
  )
}

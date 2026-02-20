"use client"

import React, { useState } from "react"
import { Plus, Pencil, Check, Baby, ChevronLeft, Trash2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import AuthLayout from "../components/AuthLayout"
import type { Profile } from "@/types/profile.types"

/* ─── Data ───────────────────────────────────────────── */
const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aria&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Liam&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Zoe&backgroundColor=d1d4f9",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Max&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Kai&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Nova&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Rex&backgroundColor=d1d4f9",
  "https://api.dicebear.com/9.x/bottts/svg?seed=SkillBot&backgroundColor=1a1a2e",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Draco&backgroundColor=16213e",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Pixel&backgroundColor=0f3460",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Nexus&backgroundColor=533483",
]

const MAX_PROFILES = 5

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

/* ─── Sub-components ─────────────────────────────────── */
function ProfileBubble({
  profile,
  onClick,
}: {
  profile: Profile
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5"
    >
      <div className="relative">
        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white/10 bg-white/6 transition group-hover:border-blue-500/60">
          <img src={profile.profilePhotoUrl} alt={profile.profileName} className="h-full w-full object-cover" />
        </div>
        {profile.kidsProfile && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 ring-2 ring-[#0a0a0f]">
            <Baby size={11} className="text-white" />
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition group-hover:opacity-100">
          <Pencil size={14} className="text-white" />
        </span>
      </div>
      <span className="max-w-18 truncate text-center text-xs text-white/70 group-hover:text-white/90">
        {profile.profileName}
      </span>
    </button>
  )
}

function EmptySlot({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-white/15 bg-white/3 transition group-hover:border-blue-500/40 group-hover:bg-white/[0.07]">
        <Plus size={20} className="text-white/25 transition group-hover:text-blue-400" />
      </div>
      <span className="text-xs text-white/20 group-hover:text-white/40">Add</span>
    </button>
  )
}

/* ─── Main component ─────────────────────────────────── */
export default function ProfilesStep() {
  const router = useRouter()

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [view, setView] = useState<"list" | "edit">("list")
  const [editingId, setEditingId] = useState<string | null>(null)

  // Draft state for the editor
  const [draftName, setDraftName] = useState("")
  const [draftAvatar, setDraftAvatar] = useState(PRESET_AVATARS[0])
  const [draftKids, setDraftKids] = useState(false)
  const [nameError, setNameError] = useState("")

  const openNew = () => {
    setEditingId(null)
    setDraftName("")
    setDraftAvatar(PRESET_AVATARS[0])
    setDraftKids(false)
    setNameError("")
    setView("edit")
  }

  const openEdit = (profile: Profile) => {
    setEditingId(profile.id)
    setDraftName(profile.profileName)
    setDraftAvatar(profile.profilePhotoUrl)
    setDraftKids(profile.kidsProfile)
    setNameError("")
    setView("edit")
  }

  const validateName = (name: string): string => {
    const trimmed = name.trim()
    if (!trimmed) return "Profile name is required"
    if (trimmed.length < 2) return "At least 2 characters"
    if (trimmed.length > 20) return "Max 20 characters"
    const duplicate = profiles.some(
      (p) => p.profileName.trim().toLowerCase() === trimmed.toLowerCase() && p.id !== editingId
    )
    if (duplicate) return "Profile name already taken"
    return ""
  }

  const handleSave = () => {
    const err = validateName(draftName)
    if (err) { setNameError(err); return }

    if (editingId) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, profileName: draftName.trim(), profilePhotoUrl: draftAvatar, kidsProfile: draftKids }
            : p
        )
      )
    } else {
      setProfiles((prev) => [
        ...prev,
        {
          id: generateId(),
          profileName: draftName.trim(),
          profilePhotoUrl: draftAvatar,
          profileType: 1,
          kidsProfile: draftKids,
        },
      ])
    }
    setView("list")
  }

  const handleDelete = () => {
    if (!editingId) return
    setProfiles((prev) => prev.filter((p) => p.id !== editingId))
    setView("list")
  }

  /* ── LIST VIEW ── */
  if (view === "list") {
    const emptySlots = MAX_PROFILES - profiles.length
    return (
      <AuthLayout step={3} totalSteps={5} title="Profiles" wide>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Create Profiles</h2>
          <p className="mt-1 text-xs text-white/40">
            Add up to {MAX_PROFILES} profiles — one per person on your account
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pb-6">
          {profiles.map((p) => (
            <ProfileBubble key={p.id} profile={p} onClick={() => openEdit(p)} />
          ))}
          {profiles.length < MAX_PROFILES &&
            Array.from({ length: emptySlots }).map((_, i) => (
              <EmptySlot key={`empty-${i}`} onClick={i === 0 ? openNew : () => {}} />
            ))}
        </div>

        <button
          type="button"
          disabled={profiles.length === 0}
          onClick={() => router.push("/register/step4")}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
            profiles.length > 0
              ? "bg-linear-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700"
              : "cursor-not-allowed bg-white/10 text-white/30"
          }`}
        >
          Continue
        </button>

        {profiles.length === 0 && (
          <p className="mt-2 text-center text-xs text-white/25">Add at least one profile to continue</p>
        )}
      </AuthLayout>
    )
  }

  /* ── EDIT VIEW ── */
  return (
    <AuthLayout step={3} totalSteps={5} title="Profiles" wide>
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setView("list")}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/50 transition hover:border-white/25 hover:text-white/80"
        >
          <ChevronLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white">
            {editingId ? "Edit Profile" : "Add Profile"}
          </h2>
          <p className="text-xs text-white/40">To continue, provide the following information.</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
        {/* Left: avatar + name + kids */}
        <div className="flex-1 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/35">
              Profile Name
            </label>
            <input
              type="text"
              value={draftName}
              maxLength={21}
              onChange={(e) => { setDraftName(e.target.value); setNameError("") }}
              onBlur={() => setNameError(validateName(draftName))}
              placeholder="e.g. Sabrina"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition bg-white/6 focus:bg-white/9 focus:ring-2 ${
                nameError
                  ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15"
                  : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/15"
              }`}
            />
            {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
          </div>

          {/* Kids toggle */}
          <div className="flex items-start justify-between gap-4 rounded-xl border border-white/6 bg-white/3 p-4">
            <div className="flex items-start gap-3">
              <Baby size={18} className="mt-0.5 shrink-0 text-blue-400/70" />
              <div>
                <p className="text-sm font-medium text-white/80">Kids Profile</p>
                <p className="mt-0.5 text-xs text-white/35">
                  Shows age-appropriate content with a simplified interface
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDraftKids((k) => !k)}
              className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-all ${
                draftKids
                  ? "border-blue-500/50 bg-blue-500"
                  : "border-white/15 bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  draftKids ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right: current avatar + pick button */}
        <div className="flex flex-col items-center gap-3">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/35">
            Avatar
          </label>
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white/15 bg-white/6">
              <img src={draftAvatar} alt="Selected avatar" className="h-full w-full object-cover" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-lg ring-2 ring-[#0a0a0f]">
              <Pencil size={11} className="text-white" />
            </span>
          </div>
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="mt-5">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/35">
          Choose Avatar
        </p>
        <div className="grid grid-cols-6 gap-2">
          {PRESET_AVATARS.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setDraftAvatar(url)}
              className={`relative overflow-hidden rounded-full border-2 transition-all ${
                draftAvatar === url
                  ? "border-blue-500 shadow-md shadow-blue-500/30"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover aspect-square" />
              {draftAvatar === url && (
                <span className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                  <Check size={14} className="text-white drop-shadow" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        {editingId && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/6 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={() => setView("list")}
          className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/50 transition hover:border-white/20 hover:text-white/70"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-600 hover:to-blue-700"
        >
          {editingId ? "Save Changes" : "Add Profile"}
        </button>
      </div>
    </AuthLayout>
  )
}


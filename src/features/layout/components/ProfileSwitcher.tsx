"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronDown, UserCircle2 } from "lucide-react"
import type { Profile } from "@/features/profiles/types/profile.types"
import type { Device } from "@/types/session.types"

type Props = {
  initialName?: string
  initialAvatar?: string | null
  initialProfiles?: Profile[]
  initialDevices?: Device[]
  activeProfileId?: string
  scrolled?: boolean
  transition?: string
}

export function ProfileSwitcher({
  initialName = "User",
  initialAvatar = null,
  initialProfiles = [],
  initialDevices = [],
  activeProfileId = "",
  scrolled = false,
  transition = "none",
}: Props) {
  const [open, setOpen] = useState(false)

  const activeProfile = useMemo(() => {
    if (!initialProfiles.length) {
      return null
    }

    if (activeProfileId) {
      const found = initialProfiles.find((p) => p.id === activeProfileId)
      if (found) return found
    }

    return initialProfiles[0]
  }, [activeProfileId, initialProfiles])

  const label = activeProfile?.profileName || initialName
  const avatar = activeProfile?.profilePhotoUrl || initialAvatar

  const occupiedProfileIds = useMemo(() => {
    return new Set(initialDevices.map((device) => device.profileId))
  }, [initialDevices])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full bg-white/8 pl-1.5 pr-2 py-1 text-white hover:bg-white/14"
        style={{ transition }}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={label}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <UserCircle2 className="h-6 w-6 text-white/70" />
        )}

        <span
          className="max-w-23 truncate font-medium"
          style={{ fontSize: scrolled ? "11px" : "13px", transition }}
        >
          {label}
        </span>

        <ChevronDown
          className={`h-4 w-4 text-white/70 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[rgba(10,10,14,0.95)] p-2 shadow-2xl backdrop-blur-xl"
          role="menu"
        >
          <div className="mb-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/35">
            Profiles
          </div>

          {initialProfiles.length === 0 ? (
            <div className="px-2 py-3 text-xs text-white/55">No profiles yet</div>
          ) : (
            initialProfiles.map((profile) => {
              const isActive = profile.id === activeProfile?.id
              const occupied = occupiedProfileIds.has(profile.id)

              return (
                <Link
                  key={profile.id}
                  href="/select-profile"
                  className={`mb-1 flex items-center justify-between rounded-xl px-2.5 py-2 transition-colors ${
                    isActive ? "bg-white/12" : "hover:bg-white/8"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{profile.profileName}</p>
                    <p className="text-[11px] text-white/45">
                      {occupied ? "In use on a device" : "Available"}
                    </p>
                  </div>
                  {isActive && (
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                      Active
                    </span>
                  )}
                </Link>
              )
            })
          )}

          <Link
            href="/select-profile"
            className="mt-1 block rounded-xl border border-white/10 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white/75 transition hover:bg-white/8 hover:text-white"
            onClick={() => setOpen(false)}
          >
            Manage Profiles
          </Link>
        </div>
      )}
    </div>
  )
}

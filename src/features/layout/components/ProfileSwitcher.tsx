"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Users, ChevronDown, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import { useSession } from "@/features/sessions/hooks/useSession";
import { getOrCreateDeviceId } from "@/utils/deviceId";
import type { Profile } from "@/features/profiles/types/profile.types";
import type { Device } from "@/types/session.types";

interface ProfileSwitcherProps {
    initialName: string;
    initialAvatar: string | null;
    /** All profiles, pre-fetched server-side so the dropdown is populated immediately */
    initialProfiles: Profile[];
    /** Connected devices, pre-fetched server-side */
    initialDevices: Device[];
    /** The activeProfileId cookie value, set when a profile was selected */
    activeProfileId: string;
    scrolled: boolean;
    transition: string;
}

export function ProfileSwitcher({
    initialName,
    initialAvatar,
    initialProfiles,
    initialDevices,
    activeProfileId,
    scrolled,
    transition,
}: ProfileSwitcherProps) {
    const router = useRouter();
    // Live query updates the dropdown after a profile switch; server data is the baseline
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [deviceId] = useState<string>(() => getOrCreateDeviceId());
    const [switching, setSwitching] = useState<string | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function onPointerDown(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    // Use live query data once available, fall back to server-provided initial data
    const profiles: Profile[] = session?.profiles ?? initialProfiles;
    const connectedDevices: Device[] = session?.connectedDevices ?? initialDevices;

    // Active profile: prefer device-matched entry, fall back to the cookie value
    const activeProfile: Profile | undefined =
        profiles.find((p) =>
            connectedDevices.some((d) => d.deviceId === deviceId && d.profileId === p.id)
        ) ?? profiles.find((p) => p.id === activeProfileId);

    const displayName = activeProfile?.profileName ?? initialName;
    const displayAvatar = activeProfile?.profilePhotoUrl || initialAvatar;
    const initial = displayName.charAt(0).toUpperCase();

    // ── handlers ────────────────────────────────────────────────────────────

    const handleSwitch = async (profile: Profile) => {
        if (profile.id === activeProfile?.id) {
            setOpen(false);
            return;
        }
        setSwitching(profile.id);
        try {
            const res = await fetch("/api/sessions/select-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId, profileId: profile.id }),
            });
            if (res.ok) {
                setOpen(false);
                // Re-run server components so the layout reflects the new profile
                router.refresh();
            }
        } finally {
            setSwitching(null);
        }
    };

    const handleLogout = async () => {
        setOpen(false);
        setLoggingOut(true);
        try {
            await fetch("/api/sessions/select-profile", { method: "DELETE" });
            await sileo.promise(fetch("/api/auth/logout", { method: "POST" }), {
                loading: { title: "Logging out..." },
                success: { title: "See you soon!" },
                error: { title: "Logout failed" },
            });
            router.push("/login");
        } finally {
            setLoggingOut(false);
        }
    };

    // ── render ───────────────────────────────────────────────────────────────

    return (
        <div ref={containerRef} className="relative flex shrink-0 items-center">
            {/* Trigger: avatar + name + chevron */}
            <button
                disabled={loggingOut}
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full px-1 py-0.5 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
                {/* Avatar */}
                <div
                    className="shrink-0 overflow-hidden rounded-full bg-linear-to-br from-blue-400 to-indigo-500 shadow-sm"
                    style={{ transition, width: scrolled ? "28px" : "36px", height: scrolled ? "28px" : "36px" }}
                >
                    {displayAvatar ? (
                        <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                        <div
                            className="flex h-full w-full items-center justify-center font-bold text-white"
                            style={{ transition, fontSize: scrolled ? "10px" : "13px" }}
                        >
                            {loggingOut ? <Loader2 size={14} className="animate-spin" /> : initial}
                        </div>
                    )}
                </div>

                {/* Name */}
                <span
                    className="hidden overflow-hidden whitespace-nowrap text-sm font-medium text-white/60 sm:block"
                    style={{ transition, opacity: scrolled ? 0 : 1, maxWidth: scrolled ? "0px" : "120px" }}
                >
                    {displayName}
                </span>

                {/* Chevron */}
                <ChevronDown
                    size={14}
                    className="hidden shrink-0 text-white/40 transition-transform duration-200 sm:block"
                    style={{
                        opacity: scrolled ? 0 : 1,
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition,
                    }}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full z-60 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#13131d] shadow-2xl shadow-black/60">

                    {/* Profile list */}
                    <div className="p-2">
                        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                            Profiles
                        </p>

                        {profiles.length === 0 && (
                            <p className="px-3 py-2 text-xs text-white/40">No profiles found</p>
                        )}

                        {profiles.map((p) => {
                            const isActive = p.id === activeProfile?.id;
                            const isOccupied =
                                !isActive &&
                                connectedDevices.some(
                                    (d) => d.profileId === p.id && d.deviceId !== deviceId
                                );
                            const isSwitching = switching === p.id;

                            return (
                                <button
                                    key={p.id}
                                    disabled={isSwitching || isOccupied}
                                    onClick={() => handleSwitch(p)}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors disabled:cursor-not-allowed ${
                                        isActive
                                            ? "bg-blue-500/15 text-white"
                                            : isOccupied
                                            ? "text-white/30"
                                            : "text-white/70 hover:bg-white/8 hover:text-white"
                                    }`}
                                >
                                    {/* Profile avatar */}
                                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
                                        {p.profilePhotoUrl ? (
                                            <img
                                                src={p.profilePhotoUrl}
                                                alt={p.profileName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-400 to-indigo-500 text-xs font-bold text-white">
                                                {p.profileName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <span className="flex-1 truncate text-sm font-medium">{p.profileName}</span>

                                    {/* Status indicators */}
                                    {isActive && (
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                                    )}
                                    {isOccupied && (
                                        <span className="shrink-0 text-[10px] text-white/30">In use</span>
                                    )}
                                    {isSwitching && (
                                        <Loader2 size={14} className="shrink-0 animate-spin text-white/60" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="border-t border-white/8" />

                    {/* Action items */}
                    <div className="p-2">
                        <button
                            onClick={() => { setOpen(false); router.push("/select-profile"); }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/8 hover:text-white"
                        >
                            <Users size={15} />
                            Switch Profile
                        </button>
                        <button
                            onClick={() => { setOpen(false); router.push("/manage-profiles"); }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/8 hover:text-white"
                        >
                            <Settings size={15} />
                            Manage Profiles
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                            <LogOut size={15} />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

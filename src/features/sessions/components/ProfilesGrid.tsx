"use client";

import { useState } from "react";
import { LogOut, MonitorX, Loader2, Trash2 } from "lucide-react";
import { sileo } from "sileo";
import { Profile as ProfileCard } from "@/features/profiles/components/profile";
import { useSession } from "@/features/sessions/hooks/useSession";
import { getOrCreateDeviceId } from "@/utils/deviceId";
import { Profile } from "@/features/profiles/types/profile.types";
import { useRouter } from "next/navigation";

// ─── Modals ──────────────────────────────────────────────────────────────────

function OccupiedModal({
    profile,
    allOccupied,
    onClose,
}: {
    profile: Profile;
    allOccupied: boolean;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="mx-4 w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1a27] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
                        <MonitorX size={28} className="text-red-400" />
                    </div>
                </div>

                <h2 className="mb-2 text-center text-lg font-bold text-white">
                    {allOccupied ? "All profiles in use" : "Profile in use"}
                </h2>

                <p className="mb-6 text-center text-sm text-white/60">
                    {allOccupied ? (
                        "All profiles on your account are currently being used on other devices. Please sign out from another device to continue."
                    ) : (
                        <>
                            <span className="font-semibold text-white">{profile.profileName}</span>
                            {" "}is currently active on another device. Please switch devices or choose a different profile.
                        </>
                    )}
                </p>

                <button
                    onClick={onClose}
                    className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                    Got it
                </button>
            </div>
        </div>
    );
}

// ─── Skeletons / Error ────────────────────────────────────────────────────────

function ProfileSkeleton() {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="h-50 w-50 animate-pulse rounded-md bg-gray-700" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-700" />
        </div>
    );
}

function ErrorState({ message }: { message?: string }) {
    return (
        <div className="flex flex-col items-center gap-3 py-6 text-center text-red-400">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm font-medium">
                {message ?? "Something went wrong. Please try again."}
            </p>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfilesGrid() {
    const { data, error, isLoading, refetch } = useSession();
    const router = useRouter();

    const [isManaging, setIsManaging] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [selectingId, setSelectingId] = useState<string | null>(null);
    const [occupiedProfile, setOccupiedProfile] = useState<Profile | null>(null);
    // Initialise synchronously so the first render already knows the device ID
    const [myDeviceId] = useState<string>(() => getOrCreateDeviceId());
    const [kickingDeviceId, setKickingDeviceId] = useState<string | null>(null);

    // ── Helpers: profile occupancy ──────────────────────────────────────────

    /** True if another device (not ours) is actively using this profile */
    function isOccupied(profile: Profile): boolean {
        if (!data?.connectedDevices) return false;
        return data.connectedDevices.some(
            (d) => d.profileId === profile.id && d.deviceId !== myDeviceId
        );
    }

    /** True if OUR device is already connected to this profile */
    function isMine(profile: Profile): boolean {
        if (!data?.connectedDevices) return false;
        return data.connectedDevices.some(
            (d) => d.profileId === profile.id && d.deviceId === myDeviceId
        );
    }

    const profiles = data?.profiles ?? [];
    const allOccupied =
        profiles.length > 0 && profiles.every((p) => isOccupied(p));

    // ── Handlers ────────────────────────────────────────────────────────────

    const handleProfileClick = async (profile: Profile) => {
        if (isManaging) {
            router.push(`/edit-profile/${profile.id}`);
            return;
        }

        // Profile occupied by another device → show modal
        if (isOccupied(profile)) {
            setOccupiedProfile(profile);
            return;
        }

        // Select profile: register device + set cookie
        setSelectingId(profile.id);
        try {
            const res = await fetch("/api/sessions/select-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId: myDeviceId, profileId: profile.id }),
            });

            if (!res.ok) {
                // Server rejected (e.g. 409 conflict) — treat as occupied
                setOccupiedProfile(profile);
                return;
            }

            router.push("/main");
        } catch {
            setOccupiedProfile(profile);
        } finally {
            setSelectingId(null);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch("/api/sessions/select-profile", { method: "DELETE" });
            await sileo.promise(fetch("/api/auth/logout", { method: "POST" }), {
                loading: { title: "Logging out..." },
                success: { title: "See you soon!" },
                error: { title: "Logout failed" },
            });
            router.push("/login");
        } catch {
            // ignore
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleKick = async (profile: Profile) => {
        const device = data?.connectedDevices?.find(
            (d) => d.profileId === profile.id && d.deviceId !== myDeviceId
        );
        if (!device) return;
        setKickingDeviceId(device.deviceId);
        try {
            await fetch(`/api/sessions/devices/${device.deviceId}`, { method: "DELETE" });
        } finally {
            setKickingDeviceId(null);
            await refetch();
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            {/* Log off */}
            <button
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="fixed right-8 top-8 z-50 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-40"
            >
                <LogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Log off"}
            </button>

            {/* All-occupied banner */}
            {!isLoading && !error && allOccupied && (
                <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-center text-sm text-red-400">
                    All profiles are currently in use on other devices.
                </p>
            )}

            {/* Grid */}
            <div className="my-10 flex flex-wrap items-center justify-center gap-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <ProfileSkeleton key={i} />)
                ) : error ? (
                    <div className="w-full">
                        <ErrorState message={error?.message} />
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="flex flex-col items-center gap-6 py-10">
                        <button
                            onClick={() => router.push("/create-profile")}
                            className="group flex cursor-pointer select-none flex-col items-center gap-3"
                        >
                            <div className="flex h-50 w-50 items-center justify-center rounded-md border-2 border-gray-600 transition-all duration-200 group-hover:-translate-y-2 group-hover:border-white">
                                <svg className="text-gray-600 transition-colors duration-200 group-hover:text-white" width="60" height="60" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium tracking-wide text-gray-600 transition-colors duration-200 group-hover:text-white">
                                Add Profile
                            </span>
                        </button>
                        <p className="text-sm text-gray-500">No profiles yet. Add your first one!</p>
                    </div>
                ) : (
                    <>
                        {profiles.map((profile) => {
                            const occupied = isOccupied(profile);
                            const mine = isMine(profile);
                            const selecting = selectingId === profile.id;

                            return (
                                <div key={profile.id} className="relative">
                                    <ProfileCard
                                        ProfileName={profile.profileName}
                                        ProfilePicture={profile.profilePhotoUrl}
                                        isKids={profile.kidsProfile}
                                        isDimmed={occupied || (!!selectingId && !selecting)}
                                        isManaging={isManaging}
                                        onClick={() => !selecting && handleProfileClick(profile)}
                                    />

                                    {/* "In use" overlay for profiles held by other devices */}
                                    {occupied && !isManaging && (() => {
                                        const occupyingDevice = data?.connectedDevices?.find(
                                            (d) => d.profileId === profile.id && d.deviceId !== myDeviceId
                                        );
                                        const isKicking = kickingDeviceId === occupyingDevice?.deviceId;
                                        return (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-black/50">
                                                <MonitorX size={28} className="text-white/80 drop-shadow" />
                                                <span className="rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white/90">
                                                    In use
                                                </span>
                                                {occupyingDevice && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleKick(profile); }}
                                                        disabled={isKicking}
                                                        className="flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/40 disabled:opacity-50"
                                                    >
                                                        {isKicking ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                                                        Kick
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* "Active here" badge for our device */}
                                    {mine && !occupied && !isManaging && (
                                        <div className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2">
                                            <span className="rounded bg-blue-600/80 px-2 py-0.5 text-xs font-semibold text-white">
                                                Active here
                                            </span>
                                        </div>
                                    )}

                                    {/* Spinner while selecting */}
                                    {selecting && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                                            <Loader2 size={32} className="animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add profile tile — only shown outside manage mode */}
                        {!isManaging && (
                            <button
                                onClick={() => router.push("/create-profile")}
                                className="group flex cursor-pointer select-none flex-col items-center gap-3"
                            >
                                <div className="flex h-50 w-50 items-center justify-center rounded-md border-2 border-gray-600 transition-all duration-200 group-hover:-translate-y-2 group-hover:border-white">
                                    <svg className="text-gray-600 transition-colors duration-200 group-hover:text-white" width="60" height="60" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium tracking-wide text-gray-600 transition-colors duration-200 group-hover:text-white">
                                    Add Profile
                                </span>
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Manage Profiles button */}
            <button
                disabled={isLoading || !!error || profiles.length === 0}
                onClick={() => setIsManaging((prev) => !prev)}
                className={`rounded-xl px-8 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                    isManaging
                        ? "bg-white text-black hover:bg-gray-200"
                        : "bg-linear-to-r from-blue-500 to-blue-600 text-white hover:scale-105 hover:from-blue-600 hover:to-blue-700"
                }`}
            >
                {isManaging ? "Done" : "Manage Profiles"}
            </button>

            {/* Occupied modal */}
            {occupiedProfile && (
                <OccupiedModal
                    profile={occupiedProfile}
                    allOccupied={allOccupied}
                    onClose={() => setOccupiedProfile(null)}
                />
            )}
        </>
    );
}
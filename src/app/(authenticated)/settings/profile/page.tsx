"use client";

import { useSession } from "@/features/sessions/hooks/useSession";
import { User, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfileSettingsPage() {
    const { data: session, isLoading } = useSession();
    const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

    useEffect(() => {
        const match = document.cookie.match(new RegExp('(^| )activeProfileId=([^;]+)'));
        if (match) setActiveProfileId(match[2]);
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <header>
                    <div className="h-9 w-64 rounded-md bg-white/10 animate-pulse" />
                    <div className="mt-2 h-4 w-96 rounded-md bg-white/5 animate-pulse" />
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-[#161622] p-8 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-6 animate-pulse" />
                        <div className="h-6 w-40 rounded-md bg-white/10 mb-6 animate-pulse" />
                        <div className="space-y-6">
                            <div>
                                <div className="h-3 w-20 rounded-sm bg-white/5 mb-2 animate-pulse" />
                                <div className="h-5 w-48 rounded-md bg-white/10 animate-pulse" />
                            </div>
                            <div>
                                <div className="h-3 w-16 rounded-sm bg-white/5 mb-2 animate-pulse" />
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-white/10 animate-pulse" />
                                    <div className="h-5 w-56 rounded-md bg-white/10 animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <div className="h-3 w-24 rounded-sm bg-white/5 mb-2 animate-pulse" />
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-white/10 animate-pulse" />
                                    <div className="h-5 w-32 rounded-md bg-white/10 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#161622] p-8 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-6 animate-pulse" />
                        <div className="h-6 w-40 rounded-md bg-white/10 mb-6 animate-pulse" />
                        <div className="flex flex-col items-center justify-center text-center space-y-4 mt-8">
                            <div className="h-24 w-24 rounded-full bg-white/10 border-2 border-white/5 animate-pulse" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-6 w-32 rounded-md bg-white/10 animate-pulse" />
                                <div className="h-4 w-24 rounded-md bg-white/5 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { profiles, userId, connectedDevicesCount, createdAt, expiresAt } = (session as any) || {};
    const activeProfile = profiles?.find((p: any) => p.id === activeProfileId) || profiles?.[0];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-semibold tracking-tight text-white">Profile Overview</h1>
                <p className="mt-2 text-sm text-white/60">
                    Manage your personal information and current active profile details.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Session / Account Info */}
                <div className="rounded-2xl border border-white/5 bg-[#161622] p-8 shadow-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mb-6">
                        <User className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">User ID</p>
                            <p className="text-sm font-mono text-white/80 break-all">{userId ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Profiles</p>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-white/50" />
                                <p className="text-base text-white">{profiles?.length ?? 0} profile{profiles?.length !== 1 ? "s" : ""}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Connected Devices</p>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-400" />
                                <p className="text-base text-green-400">{connectedDevicesCount ?? 0} device{connectedDevicesCount !== 1 ? "s" : ""}</p>
                            </div>
                        </div>
                        {expiresAt && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Session Expires</p>
                                <p className="text-sm text-white/70">{new Date(expiresAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Sub-Profile Info */}
                <div className="rounded-2xl border border-white/5 bg-[#161622] p-8 shadow-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 mb-6">
                        <UserCircle2 className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-6">Active Profile</h2>

                    {activeProfile ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-4 mt-8">
                            <img
                                src={activeProfile.profilePhotoUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                alt="Active Avatar"
                                className="h-24 w-24 rounded-full object-cover border-2 border-white/10"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-white">{activeProfile.profileName}</h3>
                                <p className="text-sm text-white/50">{activeProfile.kidsProfile ? "Kids Profile" : "Standard Profile"}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-white/50">No profile active.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Monitor, Trash2, ShieldCheck, Loader2, AlertCircle, Wifi } from "lucide-react";

interface Device {
    deviceId: string;
    profileId: string;
}

interface Session {
    sessionId: string;
    userId: string;
    profiles: { id: string; profileName: string; profilePhotoUrl?: string }[];
    connectedDevices: Device[] | null;
    connectedDevicesCount: number;
    createdAt: string;
    expiresAt: string;
}

export default function SessionsPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [kicking, setKicking] = useState<string | null>(null);
    const [kicked, setKicked] = useState<Set<string>>(new Set());

    const load = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/sessions");
            if (!res.ok) throw new Error("Failed to load session data.");
            const data = await res.json();
            setSession(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const kickDevice = async (deviceId: string) => {
        try {
            setKicking(deviceId);
            const res = await fetch(`/api/sessions/devices/${deviceId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to remove device.");
            setKicked((prev) => new Set(prev).add(deviceId));
            await load();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setKicking(null);
        }
    };

    const devices = (session?.connectedDevices ?? []).filter((d) => !kicked.has(d.deviceId));

    const getProfileName = (profileId: string) => {
        return session?.profiles.find((p) => p.id === profileId)?.profileName ?? "Unknown profile";
    };

    const formatDate = (s?: string) => {
        if (!s) return "—";
        return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-white/30" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 flex flex-col items-center text-center gap-4">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Could Not Load Sessions</h3>
                    <p className="text-white/50 text-sm">{error}</p>
                </div>
                <button onClick={load} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-white">Sessions & Devices</h1>
                <p className="mt-2 text-sm text-white/50">View and manage all devices currently connected to your account.</p>
            </header>

            {/* Session info */}
            <div className="rounded-2xl border border-white/5 bg-linear-to-br from-[#13131e] to-[#0a0a0f] p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs text-white/35 uppercase tracking-wider mb-1">Session expires</p>
                        <p className="text-sm font-medium text-white">{formatDate(session?.expiresAt)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-white/35 uppercase tracking-wider mb-1">Connected devices</p>
                        <p className="text-sm font-medium text-white">{devices.length}</p>
                    </div>
                    <div>
                        <p className="text-xs text-white/35 uppercase tracking-wider mb-1">Profiles</p>
                        <p className="text-sm font-medium text-white">{session?.profiles.length ?? 0}</p>
                    </div>
                </div>
            </div>

            {/* Devices list */}
            <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Connected Devices</h2>
                {devices.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/8 p-12 flex flex-col items-center text-center gap-3">
                        <Monitor className="w-10 h-10 text-white/15" />
                        <p className="text-sm text-white/30">No devices connected</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {devices.map((device, i) => (
                            <div
                                key={device.deviceId}
                                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-linear-to-br from-[#13131e] to-[#0a0a0f] p-5"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                    <Monitor className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-white">Device {i + 1}</p>
                                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                            <Wifi className="w-3 h-3" /> Active
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/40 mt-0.5">Profile: {getProfileName(device.profileId)}</p>
                                    <p className="text-[10px] text-white/25 font-mono mt-0.5 truncate">{device.deviceId}</p>
                                </div>
                                <button
                                    onClick={() => kickDevice(device.deviceId)}
                                    disabled={kicking === device.deviceId}
                                    className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/18 hover:text-red-300 disabled:opacity-50"
                                >
                                    {kicking === device.deviceId
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <Trash2 className="w-3.5 h-3.5" />}
                                    Kick
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-white/25 pt-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                <p>Kicking a device removes it from your session immediately.</p>
            </div>
        </div>
    );
}

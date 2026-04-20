import type { ReactNode } from "react";
import MainNav from "@/features/layout/components/main-nav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { normalizeSession } from "@/app/api/sessions/normalizeSession";
import type { Profile } from "@/features/profiles/types/profile.types";
import type { Device } from "@/types/session.types";

function isProfessorToken(token: string): boolean {
    try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) return false;
        const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
        const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as Record<string, unknown>;
        const role = String(payload.role ?? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? "").toLowerCase();
        return role === "professor";
    } catch {
        return false;
    }
}

const SESSION_FETCH_TIMEOUT_MS = 1500;

type Props = {
    children: ReactNode;
};

export default async function Layout({ children }: Props) {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("token");

    if (!userToken) {
        redirect("/login");
    }

    const activeProfileCookie = cookieStore.get("activeProfileId");
    if (!activeProfileCookie?.value) {
        redirect("/select-profile");
    }

    const isProfessor = isProfessorToken(userToken.value);
    let profileName = "User";
    let profileAvatar: string | null = null;
    let profiles: Profile[] = [];
    let connectedDevices: Device[] = [];
    let activeProfileId = activeProfileCookie.value;

    try {
        const raw = await Promise.race<unknown | null>([
            httpClient.get(API_ENDPOINTS.SESSIONS.GET_USER_SESSION) as Promise<unknown>,
            new Promise<null>((resolve) =>
                setTimeout(() => resolve(null), SESSION_FETCH_TIMEOUT_MS)
            ),
        ]);

        if (raw) {
            const session = normalizeSession(raw);

            profiles = session.profiles ?? [];
            connectedDevices = session.connectedDevices ?? [];

            const activeProfile = activeProfileId
                ? profiles.find((p) => p.id === activeProfileId)
                : profiles[0];

            if (activeProfile) {
                profileName = activeProfile.profileName;
                profileAvatar = activeProfile.profilePhotoUrl ?? null;
            }
        }
    } catch {
        // Session fetch failed — fall back to defaults; layout still renders
    }

    return (
        <div className="min-h-screen bg-[#181823] text-white">
            <MainNav
                userName={profileName}
                userAvatar={profileAvatar}
                initialProfiles={profiles}
                initialDevices={connectedDevices}
                activeProfileId={activeProfileId}
                isProfessor={isProfessor}
            />
            <main className="w-full px-4 pb-14 pt-0 sm:px-6 lg:px-10">
                {children}
            </main>
        </div>
    );
}
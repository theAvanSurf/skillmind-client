import type { ReactNode } from "react";
import MainNav from "@/features/layout/components/main-nav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { normalizeSession } from "@/app/api/sessions/normalizeSession";
import type { Profile } from "@/features/profiles/types/profile.types";
import type { Device } from "@/types/session.types";

type Props = {
    children: ReactNode;
};

export default async function Layout({ children }: Props) {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("token");

    if (!userToken) {
        redirect("/login");
    }

    let profileName = "User";
    let profileAvatar: string | null = null;
    let profiles: Profile[] = [];
    let connectedDevices: Device[] = [];
    let activeProfileId = cookieStore.get("activeProfileId")?.value ?? "";

    try {
        const raw = await httpClient.get(
            API_ENDPOINTS.SESSIONS.GET_USER_SESSION
        ) as unknown;
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
            />
            <main className="mx-auto max-w-360 px-4 pb-14 pt-0 sm:px-6 lg:px-10">
                {children}
            </main>
        </div>
    );
}
export type { Profile } from "@/types/profile.types";
export { ProfileTypes } from "@/types/profile.types";
export type { Device } from "@/types/session.types";

import { Profile } from "@/types/profile.types";
import { Device } from "@/types/session.types";

export interface SessionResponse {
    sessionId: string;
    userId: string;
    profiles: Profile[];
    connectedDevices: Device[] | null;
    connectedDevicesCount: number;
    createdAt: string;
    expiresAt: string;
}


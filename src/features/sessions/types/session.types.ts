export type { Profile } from "@/features/profiles/types/profile.types";
export { ProfileTypes } from "@/features/profiles/types/profile.types";
export type { Device, AddDeviceRequest } from "@/types/session.types";

import { Profile } from "@/features/profiles/types/profile.types";
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


import { Profile } from "../features/profiles/types/profile.types";

export interface Device {
    deviceId: string;
    profileId: string;
}

export interface AddDeviceRequest {
    DeviceId: string;
    ProfileId: string;
}

export interface Session {
    sessionId: string;
    userId: string;
    profiles: Profile[];
    connectedDevices: Device[] | null;
    connectedDevicesCount: number;
    createdAt: string;
    expiresAt: string;
}

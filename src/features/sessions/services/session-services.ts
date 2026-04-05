import { SessionResponse, AddDeviceRequest } from "@/features/sessions/types/session.types";
import axios from "axios";

export default class SessionServices {

    async getSession(): Promise<SessionResponse> {
        const response = await axios.get<SessionResponse>("/api/sessions");
        return response.data;
    }

    async addDevice(body: AddDeviceRequest): Promise<SessionResponse> {
        const response = await axios.post<SessionResponse>("/api/sessions/devices", body);
        return response.data;
    }

    async removeDevice(deviceId: string): Promise<SessionResponse> {
        const response = await axios.delete<SessionResponse>(`/api/sessions/devices/${deviceId}`);
        return response.data;
    }
}

import { SessionResponse } from "@/features/sessions/types/session.types";
import axios from "axios";

export default class SessionServices {

    async getSession(): Promise<SessionResponse> {
        const response = await axios.get<SessionResponse>("/api/sessions");
        return response.data;
    }
}

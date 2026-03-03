import { useQuery } from "@tanstack/react-query";
import { SessionResponse } from "@/features/sessions/types/session.types";
import SessionServices from "@/features/sessions/services/session-services";

const sessionService = new SessionServices();

export function useSession() {
    return useQuery<SessionResponse, Error>({
        queryKey: ["session"],
        queryFn: () => sessionService.getSession(),
    });
}

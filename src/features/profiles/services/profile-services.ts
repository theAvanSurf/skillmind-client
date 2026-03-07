import { CreateProfileRequest, Profile, UpdateProfileRequest } from "../types/profile.types";
import axios from "axios";

export class ProfilesService {

    async createProfile(request: CreateProfileRequest): Promise<Profile[]> {
        const { data } = await axios.post<Profile[]>(
            "/api/profiles",
            [request]
        );

        return data;
    }

    async createProfiles(requests: CreateProfileRequest[]): Promise<Profile[]> {
        const { data } = await axios.post<Profile[]>(
            "/api/profiles",
            requests
        );

        return data;
    }

    async updateProfile(id: string, request: UpdateProfileRequest): Promise<Profile> {
        const { data } = await axios.patch<Profile>(
            `/api/profiles/${id}`,
            request
        );

        return data;
    }

    async deleteProfile(id: string): Promise<void> {
        await axios.delete(
            `/api/profiles/${id}`
        );
    }
}
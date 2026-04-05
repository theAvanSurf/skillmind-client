import { useMutation } from "@tanstack/react-query";
import { CreateProfileRequest, Profile } from "../types/profile.types";
import { ProfilesService } from "../services/profile-services";
import { sileo } from "sileo";

const profileServices = new ProfilesService();

export function useCreateProfile() {
    return useMutation<Profile[], unknown, CreateProfileRequest>({
        mutationKey: ["create-profile"],
        mutationFn: async (request: CreateProfileRequest) => {
            return await sileo.promise(profileServices.createProfile(request), {
                loading: { title: "Creating profile..." },
                success: {
                    title: "Profile Created",
                    description: "Your new profile has been added successfully."
                },
                error: (err: any) => ({
                    title: "Failed to create profile",
                    description: err.message || "An unexpected error occurred"
                })
            });
        },
    });
}
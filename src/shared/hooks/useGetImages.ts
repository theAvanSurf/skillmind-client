import { useQuery } from "@tanstack/react-query";
import { MediaServices } from "../services/media-services";
import { MediaResponse } from "@/types/assets.type";

const mediaServices = new MediaServices();

export function useGetImages() {
    return useQuery<MediaResponse[], Error>({
        queryKey: ["images"],
        queryFn: async () => {
            return await mediaServices.getImages();
        }
    });
}
import axios from "axios";
import { MediaResponse } from "@/types/assets.type";

export class MediaServices {
    async getImages(): Promise<MediaResponse[]> {
        const response = await axios.get<{ images: MediaResponse[] }>("/api/images");
        return response.data.images;
    }
}
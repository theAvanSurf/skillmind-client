export interface MediaResponse {
    publicId: string;
    url: string;
    secureUrl: string;
    format: string;
    bytes: number;
    createdAt: string; // o Date si lo parseas
}
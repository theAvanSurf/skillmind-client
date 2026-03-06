export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login'
    },
    SESSIONS: {
        GET_USER_SESSION: '/sessions'
    },
    ASSETS: {
        MEDIA_GET_IMAGES: '/media-upload/images'
    },
    PROFILES: {
        CREATE: '/profiles',
        UPDATE: (id: string) => `/profiles/${id}`,
        DELETE: (id: string) => `/profiles/${id}`,
    }
}
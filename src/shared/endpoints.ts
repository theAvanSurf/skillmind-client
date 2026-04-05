export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        SIGN_UP: '/auth/sign-up',
        CONFIRM: '/auth/confirm',
    },
    SESSIONS: {
        GET_USER_SESSION: '/sessions',
        ADD_DEVICE: '/sessions/devices',
        REMOVE_DEVICE: (deviceId: string) => `/sessions/devices/${deviceId}`,
        ADD_PROFILE: '/sessions/profiles',
        REMOVE_PROFILE: (profileId: string) => `/sessions/profiles/${profileId}`,
    },
    ASSETS: {
        MEDIA_GET_IMAGES: '/media-upload/images'
    },
    PAYMENT: {
        CREATE_SUBSCRIPTION: '/payment/create-subscription',
        CREATE_CHECKOUT_SESSION: '/payment/create-checkout-session',
        SESSION_STATUS: '/payment/session-status',
        CREATE_PORTAL_SESSION: '/payment/create-portal-session',
        SUBSCRIPTION: '/payment/subscription',
    },
    COURSES: {
    GET_BY_ID: (id: string) => `/courses/${id}`,
    GET_RELATED: (id: string) => `/courses/${id}/related`,
    UPDATE_PROGRESS: (id: string) => `/courses/${id}/progress`,
    },
    PROFILES: {
        CREATE: '/profiles',
        UPDATE: (id: string) => `/profiles/${id}`,
        DELETE: (id: string) => `/profiles/${id}`,
    }
}
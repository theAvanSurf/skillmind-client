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
        BROWSE: '/courses',
        SEARCH_SUGGESTIONS: '/courses/search',
        CATEGORIES: '/courses/categories',
        MY_ENROLLMENTS: '/courses/my-enrollments',
        GET_BY_ID: (id: string) => `/courses/${id}`,
        GET_RELATED: (id: string) => `/courses/${id}/related`,
        UPDATE_PROGRESS: (id: string) => `/courses/${id}/progress`,
    },
    PROFILES: {
        CREATE: '/profiles',
        UPDATE: (id: string) => `/profiles/${id}`,
        DELETE: (id: string) => `/profiles/${id}`,
    },
    RECOMMENDATIONS: {
        GET: (profileId: string) => `/recommendations/${profileId}`,
        TRACK: '/recommendations/events/track',
        TRENDING: '/recommendations/trending/courses'
    },
    PROFESSOR: {
        PROFILE: '/professor/profile',
        DASHBOARD: '/professor/dashboard',
        EARNINGS: '/professor/earnings',
        STUDENTS: '/professor/students',
        COURSES: '/professor/courses',
        COURSE: (id: string) => `/professor/courses/${id}`,
        PUBLISH_COURSE: (id: string) => `/professor/courses/${id}/publish`,
        SEASONS: '/professor/seasons',
        LESSONS: '/professor/lessons',
        EXAMS: '/professor/exams',
        EXAM: (id: string) => `/professor/exams/${id}`,
        EXAM_QUESTIONS: (id: string) => `/professor/exams/${id}/questions`,
        EXAM_PUBLISH: (id: string) => `/professor/exams/${id}/publish`,
        EXAM_ATTEMPTS: (id: string) => `/professor/exams/${id}/attempts`,
        GRADE_OPEN_TEXT: '/professor/exams/attempts/grade',
        CERT_TEMPLATES: '/professor/certificates/templates',
        CERT_TEMPLATE: (id: string) => `/professor/certificates/templates/${id}`,
        CERT_ISSUE: '/professor/certificates/issue',
        CERTS_BY_COURSE: (id: string) => `/professor/certificates/course/${id}`,
        STRIPE_STATUS: '/professor/stripe/status',
        STRIPE_CONNECT: '/professor/stripe/connect',
    }
}
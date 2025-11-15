export const API_CONFIG = {
    BASE_URL: "http://192.168.18.82:8080/api",
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json'
    }
}

export const API_ENDPOINTS = {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    REFRESH: "auth/refresh",
    LOGOUT: "auth/logout",
    GET_PROFILE: "auth/me",
    CHECK_IN: "check/in",
    CHECK_OUT: "check/out",
    GET_CONCURRENCY: "check/concurrency",
    GET_USER_STATUS: "check/status",
    SAVE_HEART_RATE: "heart-rate/{userId}",
    GET_HEART_RATE: "heart-rate/{userId}"
}

export const buildUrl = (endpoint: string): string => {
    return "${API_CONFIG.BASE_URL}${endpoint}"
}

export interface ApiError {
    message : string,
    statusCode? : number;
    errors? : Record<string,string[]>
}

export const handleApiError = (error: any): ApiError => {
    if (error.response) {
        return {
            message : error.response.data?.message || "Error en el servidor",
            statusCode: error.response.status,
            errors: error.response.data?.errors
        }
    }
    else if (error.request) {
        return {
            message: "No se pudo conectar al servidor. Verifica tu conexion"
        }
    }
    else {
        return {
            message : error.message || "Error inesperado"
        }
    }
}
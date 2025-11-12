import { API_CONFIG, handleApiError } from "@/src/core/config/api";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { LocalStorage } from "../storage/LocalStorage";
import { STORAGE_KEYS } from "@/src/core/constants/storage-keys";

class ApiClient {
    private client: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
    }> = [];

    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: API_CONFIG.HEADERS
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {

        this.client.interceptors.request.use(
            async (config) => {
                const token = await LocalStorage.getSecure(STORAGE_KEYS.ACCESS_TOKEN);

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {

                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                return this.client(originalRequest);
                            })
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = await LocalStorage.getSecure(STORAGE_KEYS.REFRESH_TOKEN);

                        if (!refreshToken) {
                            throw new Error('No refresh token');
                        }

                        const response = await this.client.post('/auth/refresh', {
                            refreshToken
                        });

                        const { accessToken } = response.data;

                        await LocalStorage.setSecure(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

                        
                        this.failedQueue.forEach((prom) => prom.resolve(accessToken));
                        this.failedQueue = [];

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return this.client(originalRequest);
                    } catch (refreshError) {

                        this.failedQueue.forEach((prom) => prom.reject(refreshError));
                        this.failedQueue = [];

                        await LocalStorage.removeSecure(STORAGE_KEYS.ACCESS_TOKEN);
                        await LocalStorage.removeSecure(STORAGE_KEYS.REFRESH_TOKEN);
                        await LocalStorage.remove(STORAGE_KEYS.USER_DATA);

                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(handleApiError(error));
            }
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete(url, config);
        return response.data;

    }

}

export const apiClient = new ApiClient();

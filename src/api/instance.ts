import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { apiErrorCodes } from "./errorCodes";
import { LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_REFRESH_TOKEN } from "@constants/constants";
import { authAPI } from "@store/features/auth-slice/auth-api";
import { PATHS } from "@router/paths";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL || "http://127.0.0.1:3001",
    withCredentials: true,
});

// Отдельный instance для refresh запросов (без интерцепторов)
export const refreshInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL || "http://127.0.0.1:3001",
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    console.log('interceptors_token:', token)
    if (config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

type ResponseErrorType = {
    message: string;
    status: string;
};

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    subscribers.map((callback) => callback(token));
};

const addSubscriber = (callback: (token: string) => void) => {
    subscribers.push(callback);
};

instance.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error: AxiosError<ResponseErrorType>) => {
        const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Проверка на истекший refresh token
        if (error.response?.status === apiErrorCodes.RefreshTokenExpiredCode ||
                error.response?.data.message === "Invalid or expired refresh token") {
            localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
            window.location.href = PATHS.auth;
            return Promise.reject(error);
        }

        if (
            (error.response?.status === apiErrorCodes.AccessTokenInvalidCode ||
                error.response?.status === apiErrorCodes.unauthorizedCode ||
                error.response?.data.message === "Could not validate credentials") &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addSubscriber((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(instance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Refresh token теперь передается через cookies автоматически
                const res = await authAPI.refreshToken();
                const accessToken = res.data.accessToken;

                localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                isRefreshing = false;
                onRefreshed(accessToken);
                subscribers = [];

                return instance(originalRequest);
            } catch (refreshError: unknown) {
                isRefreshing = false;
                subscribers = [];
                
                // Если refresh token невалиден или просрочен - очищаем токены и редиректим
                localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
                localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
                window.location.href = PATHS.auth;

                return Promise.reject(refreshError);
            }
        } else if (error.response?.status === apiErrorCodes.serverErrorCode) {
            // window.location.href = PATHS.serverIsAvailable;
        }

        return Promise.reject(error);
    }
);

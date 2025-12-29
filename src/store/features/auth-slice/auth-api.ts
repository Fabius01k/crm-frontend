import { instance, refreshInstance } from "@api/instance";
import type { LoginCredentials, LoginResponse } from "./auth-types.ts";
import type { AxiosResponse } from "axios";

const authApiBaseURI = "auth";

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<{ data: LoginResponse }> => {
        const response = await instance.post<LoginResponse>(`${authApiBaseURI}/login`, credentials);
        return { data: response.data };
    },
    logout: async (): Promise<void> => {
        await instance.post(`${authApiBaseURI}/logout`);
    },
    refreshToken: (): Promise<AxiosResponse<LoginResponse>> => {
        return refreshInstance.post(`${authApiBaseURI}/refresh`);
    },
};

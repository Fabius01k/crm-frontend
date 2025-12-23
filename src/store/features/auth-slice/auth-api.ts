import { instance, refreshInstance } from "@api/instance";
import type { LoginCredentials, LoginResponse } from "./auth-thunks.ts";
import type { UserType } from "./auth-types.ts";
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
    getProfile: async (): Promise<{ data: UserType }> => {
        const response = await instance.get<UserType>(`${authApiBaseURI}/profile`);
        return { data: response.data };
    },
    refreshToken: (): Promise<AxiosResponse<Pick<AuthResponseType, "accessToken">>> => {
        return refreshInstance.post(`${authApiBaseURI}/refresh`);
    },
};

export type AuthResponseType = {
    accessToken: string;
    refreshToken: string;
};
export type UserRoleType = "teamlead" | "employee";

export type AuthUserType = {
    id: string | null,
    name: string,
    role: UserRoleType,
}

export interface AuthSliceType {
    user: AuthUserType,

    loading: boolean,
    error: string | null,
}

export const authSliceInitialState: AuthSliceType = {
    user: {
        id: null,
        name: "",
        role: "employee",
    },

    loading: false,
    error: null,
}

export interface LoginResponse {
    accessToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

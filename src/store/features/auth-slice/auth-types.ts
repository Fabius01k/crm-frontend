export type UserType = {
    id: string | null,
    name: string,
}

export interface AuthSliceType {
    user: UserType,

    loading: boolean,
    error: string | null,
}

export const authSliceInitialState: AuthSliceType = {
    user: {
        id: null,
        name: "",
    },

    loading: false,
    error: null,
}
import type {AuthSliceType, AuthUserType} from "./auth-types.ts";
import type {PayloadAction} from "@reduxjs/toolkit";

export const authActs = {
    // setProfile: (state: AuthSliceType, action: PayloadAction<AuthUserType>)=> {
    //     state.user.id = action.payload.id;
    //     state.user.name = action.payload.name;
    // },
    setLoading: (state: AuthSliceType, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
    },
    setError: (state: AuthSliceType, action: PayloadAction<string | null>) => {
        state.error = action.payload;
    },
    setUser: (state: AuthSliceType, action: PayloadAction<AuthUserType>) => {
        state.user = action.payload;
    },
    logout: (state: AuthSliceType) => {
        state.user.id = null;
        state.user.name = "";
    },
}
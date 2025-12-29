import type {AuthSliceType, UserType} from "./auth-types.ts";
import type {PayloadAction} from "@reduxjs/toolkit";

export const authActs = {
    setProfile: (state: AuthSliceType, action: PayloadAction<UserType>)=> {
        state.user.id = action.payload.id;
        state.user.name = action.payload.name;
    },
    setLoading: (state: AuthSliceType, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
    },
    setError: (state: AuthSliceType, action: PayloadAction<string | null>) => {
        state.error = action.payload;
    },
    logout: (state: AuthSliceType) => {
        state.user.id = null;
        state.user.name = "";
    },
}
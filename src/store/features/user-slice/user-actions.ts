import type { UserSliceType, User, UserPageDto } from "./user-types";
import type { PayloadAction } from "@reduxjs/toolkit";

export const userActs = {
    setUsers: (state: UserSliceType, action: PayloadAction<User[]>) => {
        state.users = action.payload;
    },
    setCurrentUser: (state: UserSliceType, action: PayloadAction<UserPageDto | null>) => {
        state.currentUser = action.payload;
    },
    setLoading: (state: UserSliceType, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
    },
    setError: (state: UserSliceType, action: PayloadAction<string | null>) => {
        state.error = action.payload;
    },
    setPagination: (
        state: UserSliceType,
        action: PayloadAction<{
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        } | null>
    ) => {
        state.pagination = action.payload;
    },
    setSearchQuery: (state: UserSliceType, action: PayloadAction<string>) => {
        state.searchQuery = action.payload;
    },
    addUser: (state: UserSliceType, action: PayloadAction<User>) => {
        state.users.push(action.payload);
    },
    updateUser: (state: UserSliceType, action: PayloadAction<User>) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
            state.users[index] = action.payload;
        }
    },
    removeUser: (state: UserSliceType, action: PayloadAction<string>) => {
        state.users = state.users.filter(u => u.id !== action.payload);
    },
};
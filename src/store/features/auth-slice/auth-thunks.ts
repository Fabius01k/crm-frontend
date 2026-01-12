import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { authAPI } from "./auth-api.ts";
import { LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_REFRESH_TOKEN } from "@constants/constants";
import type { LoginCredentials, LoginResponse } from "./auth-types.ts";
// import { userThunks } from '../user-slice/user-thunks';

export const authThunks = {

    /**
     * Thunk для входа пользователя.
     * createAsyncThunk принимает три generic-аргумента:
     * 1. Тип возвращаемого значения при успехе (fulfilled).
     * 2. Тип аргумента, передаваемого в thunk.
     * 3. Конфигурация для thunkAPI, где можно указать тип для `rejectValue`.
     */
    loginUser: createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
        'auth/loginUser',
        async (credentials, thunkAPI) => {
            try {
                const response = await authAPI.login(credentials);
                // После успешного логина запрашиваем профиль пользователя для обновления userId
                // thunkAPI.dispatch(userThunks.fetchCurrentUserProfile());
                return response.data; // Это значение станет payload для fulfilled action
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    /**
     * Thunk для обновления токенов.
     * Используется при истечении access token.
     * Refresh token передается через cookies.
     */
    refreshToken: createAsyncThunk<LoginResponse, void, { rejectValue: string }>(
        'auth/refreshToken',
        async (_, thunkAPI) => {
            try {
                const response = await authAPI.refreshToken();
                return { accessToken: response.data.accessToken };
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    /**
     * Thunk для выхода пользователя из системы.
     */
    logoutUser: createAsyncThunk<void, void, { rejectValue: string }>(
        'auth/logoutUser',
        async (_, thunkAPI) => {
            try {
                await authAPI.logout();
                localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
                localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),
};

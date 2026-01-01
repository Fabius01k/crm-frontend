import { createSlice } from '@reduxjs/toolkit'
import { authSliceInitialState, type AuthSliceType } from "./auth-types.ts";
import { authActs } from "./auth-actions.ts";
import { authThunks } from "./auth-thunks.ts";
import { toast } from "react-toastify";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { LOCAL_STORAGE_ACCESS_TOKEN, LOCAL_STORAGE_REFRESH_TOKEN } from '@constants/constants';

const authSlice = createSlice({
    name: 'auth-slice',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState: authSliceInitialState as AuthSliceType,
    reducers: {
        ...authActs
    },
    extraReducers: (builder) => {
        builder
            .addCase(authThunks.loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(authThunks.loginUser.fulfilled, (state, action) => {
                state.loading = false;
                // console.log('loginUser.fulfilled payload:', action.payload);
                if (action.payload && action.payload.accessToken) {
                    const decoded = jwtDecode<JwtPayload>(action.payload.accessToken);
                    if (decoded.sub) {
                        state.user.id = decoded.sub;
                    }
                    // Сохраняем только access token в localStorage
                    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, action.payload.accessToken);
                    // Refresh token теперь хранится в cookies (httpOnly), не сохраняем в localStorage
                }
                console.log('state after login:', state.user);
            })
            .addCase(authThunks.loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Произошла ошибка входа';
                // Показываем toast только для ошибок логина, исключая системные ошибки (например, refresh token)
                if (action.payload && !action.payload.includes('Refresh token')) {
                    toast.error(action.payload);
                }
            })
            // Добавляем обработку для refreshToken
            .addCase(authThunks.refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(authThunks.refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.accessToken) {
                    // Обновляем access token в localStorage
                    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, action.payload.accessToken);
                    // Refresh token обновляется автоматически в cookies
                }
            })
            .addCase(authThunks.refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка обновления токена';
                // При ошибке refresh token делаем logout
                if (action.payload && action.payload.includes('Refresh token')) {
                    toast.error('Сессия истекла. Пожалуйста, войдите снова.');
                    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
                    localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
                    state.user = { id: null, name: "" };
                }
            })
            // Добавляем обработку для logoutUser
            .addCase(authThunks.logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(authThunks.logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = { id: null, name: "" };
                // Очищаем localStorage при выходе
                localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);
                localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN);
            })
            .addCase(authThunks.logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Произошла ошибка выхода';
            });
    },
})

export const authSliceActions = authSlice.actions
export default authSlice.reducer
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { userAPI } from "./user-api";
import { authSliceActions } from "../auth-slice/auth-slice";
import type {
    CreateUserDto,
    UpdateUserProfileDto,
    UpdateUserWorkInfoDto,
    ChangeOwnPasswordDto,
    AdminChangePasswordDto,
    FindUsersDto,
    UsersResponse,
    UserPageDto,
    UserProfileType,
    CompanyStructureResponse,
    DeleteUserDto,
} from "./user-types";
import type { UserRoleType } from '../auth-slice/auth-types';
// import { userActs } from './user-actions';

export const userThunks = {
    // Получить список пользователей с фильтрацией
    fetchUsers: createAsyncThunk<UsersResponse, FindUsersDto | undefined, { rejectValue: string }>(
        'users/fetchUsers',
        async (params, thunkAPI) => {
            try {
                const response = await userAPI.getUsers(params);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Поиск пользователей
    searchUsers: createAsyncThunk<UsersResponse, string, { rejectValue: string }>(
        'users/searchUsers',
        async (query, thunkAPI) => {
            try {
                const response = await userAPI.searchUsers(query);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Получить текущего пользователя (страница)
    // fetchCurrentUserPage: createAsyncThunk<UserPageDto, void, { rejectValue: string }>(
    //     'users/fetchCurrentUserPage',
    //     async (_, thunkAPI) => {
    //         try {
    //             const response = await userAPI.getCurrentUserPage();
    //             return response;
    //         } catch (error) {
    //             const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
    //             const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
    //             return thunkAPI.rejectWithValue(errorMessage);
    //         }
    //     }
    // ),

    // Получить расширенный профиль текущего пользователя (с вложенными объектами)
    fetchCurrentUserProfile: createAsyncThunk<UserProfileType, void, { rejectValue: string }>(
        'users/fetchCurrentUserProfile',
        async (_, thunkAPI) => {
            try {
                const response = await userAPI.getCurrentUserProfile();
                const user = {
                    id: response.id,
                    role: response.role as UserRoleType,
                    name: response.profile.firstName && response.profile.lastName
                        ? `${response.profile.firstName} ${response.profile.lastName}`
                        : response.email
                }
                // Диспатчим пользователя в auth-slice
                thunkAPI.dispatch(authSliceActions.setUser(user));
                // thunkAPI.dispatch(userActs.setCurrentUser(response))
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Получить пользователя по ID (страница)
    fetchUserPage: createAsyncThunk<UserPageDto, string, { rejectValue: string }>(
        'users/fetchUserPage',
        async (id, thunkAPI) => {
            try {
                const response = await userAPI.getUserPage(id);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Создать пользователя
    createUser: createAsyncThunk<{ id: string }, CreateUserDto, { rejectValue: string }>(
        'users/createUser',
        async (data, thunkAPI) => {
            try {
                const response = await userAPI.createUser(data);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Обновить профиль пользователя
    updateUserProfile: createAsyncThunk<
        { message: string; profile: UpdateUserProfileDto },
        { id: string; data: UpdateUserProfileDto },
        { rejectValue: string }
    >(
        'users/updateUserProfile',
        async ({ id, data }, thunkAPI) => {
            try {
                const response = await userAPI.updateUserProfile(id, data);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Обновить рабочую информацию
    updateUserWorkInfo: createAsyncThunk<
        { message: string },
        { id: string; data: UpdateUserWorkInfoDto },
        { rejectValue: string }
    >(
        'users/updateUserWorkInfo',
        async ({ id, data }, thunkAPI) => {
            try {
                const response = await userAPI.updateUserWorkInfo(id, data);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Изменить собственный пароль
    changeOwnPassword: createAsyncThunk<{ message: string }, ChangeOwnPasswordDto, { rejectValue: string }>(
        'users/changeOwnPassword',
        async (data, thunkAPI) => {
            try {
                const response = await userAPI.changeOwnPassword(data);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Изменить пароль пользователя (админ)
    changeUserPassword: createAsyncThunk<
        { message: string },
        { id: string; data: AdminChangePasswordDto },
        { rejectValue: string }
    >(
        'users/changeUserPassword',
        async ({ id, data }, thunkAPI) => {
            try {
                const response = await userAPI.changeUserPassword(id, data);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Удалить/восстановить пользователя (мягкое удаление)
    deleteUser: createAsyncThunk<{ message: string }, { id: string; data: DeleteUserDto }, { rejectValue: string }>(
        'users/deleteUser',
        async ({ id, data }, thunkAPI) => {
            try {
                const response = await userAPI.deleteUser(id, data);
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),

    // Получить структуру компании
    fetchCompanyStructure: createAsyncThunk<CompanyStructureResponse, void, { rejectValue: string }>(
        'users/fetchCompanyStructure',
        async (_, thunkAPI) => {
            try {
                const response = await userAPI.getCompanyStructure();
                return response;
            } catch (error) {
                const axiosError = error as AxiosError<{ message?: string; error?: string; statusCode?: number }>;
                const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error';
                return thunkAPI.rejectWithValue(errorMessage);
            }
        }
    ),
};
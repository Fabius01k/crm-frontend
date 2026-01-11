import { createSlice } from '@reduxjs/toolkit';
import { userSliceInitialState, type UserSliceType } from "./user-types";
import { userActs } from "./user-actions";
import { userThunks } from "./user-thunks";
import { toast } from "react-toastify";

const userSlice = createSlice({
    name: 'user-slice',
    initialState: userSliceInitialState as UserSliceType,
    reducers: {
        ...userActs
    },
    extraReducers: (builder) => {
        // fetchUsers
        builder
            .addCase(userThunks.fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(userThunks.fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка загрузки пользователей';
                toast.error(state.error);
            });

        // searchUsers
        builder
            .addCase(userThunks.searchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.searchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
                state.pagination = action.payload.meta;
            })
            .addCase(userThunks.searchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка поиска пользователей';
                toast.error(state.error);
            });

        // fetchCurrentUserPage
        // builder
        //     .addCase(userThunks.fetchCurrentUserPage.pending, (state) => {
        //         state.loading = true;
        //         state.error = null;
        //     })
        //     .addCase(userThunks.fetchCurrentUserPage.fulfilled, (state, action) => {
        //         state.loading = false;
        //         state.currentUser = action.payload;
        //     })
        //     .addCase(userThunks.fetchCurrentUserPage.rejected, (state, action) => {
        //         state.loading = false;
        //         state.error = action.payload ?? 'Ошибка загрузки текущего пользователя';
        //         toast.error(state.error);
        //     });

        // fetchCurrentUserProfile
        builder
            .addCase(userThunks.fetchCurrentUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.fetchCurrentUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUserProfile = action.payload;
            })
            .addCase(userThunks.fetchCurrentUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка загрузки профиля пользователя';
                toast.error(state.error);
            });

        // fetchUserPage
        builder
            .addCase(userThunks.fetchUserPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.fetchUserPage.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                // Обновляем или добавляем пользователя в список
                // const index = state.users.findIndex(u => u.id === action.payload.id);
                // if (index !== -1) {
                //     state.users[index] = action.payload;
                // } else {
                //     state.users.push(action.payload);
                // }
                // state.currentUserProfile = action.payload;

            })
            .addCase(userThunks.fetchUserPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка загрузки пользователя';
                toast.error(state.error);
            });

        // createUser
        builder
            .addCase(userThunks.createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.createUser.fulfilled, (state, _action) => {
                state.loading = false;
                // Пользователь создан, но не добавляем в список, так как нет полных данных
                toast.success('Пользователь успешно создан');
            })
            .addCase(userThunks.createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка создания пользователя';
                toast.error(state.error);
            });

        // updateUserProfile
        builder
            .addCase(userThunks.updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Обновляем currentUser если это он
                if (state.currentUser && state.currentUser.id === action.meta.arg.id) {
                    state.currentUser = { ...state.currentUser, ...action.meta.arg.data };
                }
                // Обновляем в списке пользователей
                const index = state.users.findIndex(u => u.id === action.meta.arg.id);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], ...action.meta.arg.data };
                }
                toast.success('Профиль обновлён');
            })
            .addCase(userThunks.updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка обновления профиля';
                toast.error(state.error);
            });

        // updateUserWorkInfo
        builder
            .addCase(userThunks.updateUserWorkInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.updateUserWorkInfo.fulfilled, (state) => {
                state.loading = false;
                toast.success('Рабочая информация обновлена');
            })
            .addCase(userThunks.updateUserWorkInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка обновления рабочей информации';
                toast.error(state.error);
            });

        // changeOwnPassword
        builder
            .addCase(userThunks.changeOwnPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.changeOwnPassword.fulfilled, (state) => {
                state.loading = false;
                toast.success('Пароль успешно обновлён');
            })
            .addCase(userThunks.changeOwnPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка смены пароля';
                toast.error(state.error);
            });

        // changeUserPassword
        builder
            .addCase(userThunks.changeUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.changeUserPassword.fulfilled, (state) => {
                state.loading = false;
                toast.success('Пароль пользователя изменён администратором');
            })
            .addCase(userThunks.changeUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка смены пароля пользователя';
                toast.error(state.error);
            });

        // deleteUser
        builder
            .addCase(userThunks.deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                const { id, data } = action.meta.arg;
                if (data.isDeleted) {
                    // Удаляем пользователя из списка
                    state.users = state.users.filter(u => u.id !== id);
                    toast.success('Пользователь удалён');
                } else {
                    // Восстанавливаем пользователя (нужно перезагрузить список)
                    toast.success('Пользователь восстановлен');
                }
            })
            .addCase(userThunks.deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка удаления/восстановления пользователя';
                toast.error(state.error);
            });

        // fetchCompanyStructure
        builder
            .addCase(userThunks.fetchCompanyStructure.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userThunks.fetchCompanyStructure.fulfilled, (state, action) => {
                state.loading = false;
                state.companyStructure = action.payload; // сохраняем весь ответ
            })
            .addCase(userThunks.fetchCompanyStructure.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Ошибка загрузки структуры компании';
                toast.error(state.error);
            });
    },
});

export const userSliceActions = userSlice.actions;
export default userSlice.reducer;
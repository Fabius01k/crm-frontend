import { instance } from "@api/instance";
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
} from "./user-types";

const userApiBaseURI = "users";

export const userAPI = {
    // POST /users
    createUser: async (data: CreateUserDto): Promise<{ id: string }> => {
        const response = await instance.post<{ id: string }>(userApiBaseURI, data);
        return response.data;
    },

    // GET /users
    getUsers: async (params?: FindUsersDto): Promise<UsersResponse> => {
        const response = await instance.get<UsersResponse>(userApiBaseURI, { params });
        return response.data;
    },

    // GET /users/search?q=...
    searchUsers: async (query: string): Promise<UsersResponse> => {
        const response = await instance.get<UsersResponse>(`${userApiBaseURI}/search`, {
            params: { q: query },
        });
        return response.data;
    },

    // GET /users/me/page (требует JWT)
    // getCurrentUserPage: async (): Promise<UserPageDto> => {
    //     const response = await instance.get<UserPageDto>(`${userApiBaseURI}/me/page`);
    //     return response.data;
    // },

    // GET /users/me/profile (требует JWT) - расширенный профиль с вложенными объектами
    getCurrentUserProfile: async (): Promise<UserProfileType> => {
        const response = await instance.get<UserProfileType>(`${userApiBaseURI}/me/page`);
        return response.data;
    },

    // GET /users/:id/page
    getUserPage: async (id: string): Promise<UserPageDto> => {
        const response = await instance.get<UserPageDto>(`${userApiBaseURI}/${id}/page`);
        return response.data;
    },

    // PUT /users/:id/profile
    updateUserProfile: async (id: string, data: UpdateUserProfileDto): Promise<{ message: string; profile: UpdateUserProfileDto }> => {
        const response = await instance.put<{ message: string; profile: UpdateUserProfileDto }>(
            `${userApiBaseURI}/${id}/profile`,
            data
        );
        return response.data;
    },

    // PUT /users/:id/work-info
    updateUserWorkInfo: async (id: string, data: UpdateUserWorkInfoDto): Promise<{ message: string }> => {
        const response = await instance.put<{ message: string }>(
            `${userApiBaseURI}/${id}/work-info`,
            data
        );
        return response.data;
    },

    // PUT /users/me/password
    changeOwnPassword: async (data: ChangeOwnPasswordDto): Promise<{ message: string }> => {
        const response = await instance.put<{ message: string }>(
            `${userApiBaseURI}/me/password`,
            data
        );
        return response.data;
    },

    // PUT /users/:id/password (только для teamlead)
    changeUserPassword: async (id: string, data: AdminChangePasswordDto): Promise<{ message: string }> => {
        const response = await instance.put<{ message: string }>(
            `${userApiBaseURI}/${id}/password`,
            data
        );
        return response.data;
    },

    // DELETE /users/:id
    deleteUser: async (id: string): Promise<{ message: string }> => {
        const response = await instance.delete<{ message: string }>(`${userApiBaseURI}/${id}`);
        return response.data;
    },

    // GET /company/structure
    getCompanyStructure: async (): Promise<CompanyStructureResponse> => {
        const response = await instance.get<CompanyStructureResponse>("company/structure");
        return response.data;
    },
};
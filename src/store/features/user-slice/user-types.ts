export interface User {
    id: string;
    fullName: string;
    department: string | null;
    position: string | null;
    grade: string | null;
    workSchedule: string | null;
    preferredShiftType: string | null;
    email?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthDate?: string;
    phoneNumber?: string;
    tgLink?: string;
    role?: string;
}

export type UserPageDto = User

export interface UserProfileType {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    profile: {
        firstName: string | null;
        lastName: string | null;
        middleName: string | null;
        birthDate: Date | null;
        phoneNumber: string | null;
        tgLink: string | null;
    };
    workInfo: {
        department: string | null;
        position: string | null;
        grade: string | null;
        workSchedule: string | null;
        preferredShiftType: string | null;
    };
}

export interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: string;
    phoneNumber?: string;
    tgLink?: string;
    role?: string;
    grade?: string;
    preferredShiftType?: string;
    workSchedule?: string;
    department?: string;
    position?: string;
}

export interface UpdateUserProfileDto {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthDate?: string;
    phoneNumber?: string;
    tgLink?: string;
}

export interface UpdateUserWorkInfoDto {
    department?: string;
    position?: string;
    workSchedule?: string;
    preferredShiftType?: string;
    grade?: string;
}

export interface ChangeOwnPasswordDto {
    oldPassword: string;
    newPassword: string;
}

export interface AdminChangePasswordDto {
    newPassword: string;
}

export interface FindUsersDto {
    department?: string;  // Код отдела
    position?: string;    // Код позиции
    grade?: string;
    workSchedule?: string;
    preferredShiftType?: string;
    page?: number;
}

// Тип для фильтров в UI (хранит коды, но отображаются названия)
export interface FilterState {
    department: string;   // Код отдела
    position: string;     // Код позиции
    grade: string;
    scheduleType: string;
    shiftType: string;
}

export interface UsersResponse {
    data: User[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface Position {
    code: string;
    name: string;
}

export interface CompanyStructureItem {
    code: string;
    name: string;
    positions: Position[];
}

export interface CompanyStructureResponse {
    data: CompanyStructureItem[];
}

export interface UserSliceType {
    users: User[];
    currentUser: UserPageDto | null;
    currentUserProfile: UserProfileType | null;
    companyStructure: CompanyStructureItem[] | null;
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
    searchQuery: string;
}

export const userSliceInitialState: UserSliceType = {
    users: [],
    currentUser: null,
    currentUserProfile: null,
    companyStructure: null,
    loading: false,
    error: null,
    pagination: null,
    searchQuery: '',
};
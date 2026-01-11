// Заменим типы, основанные на enum, на строки
export type DepartmentCode = string;
export type PositionCode = string;
export type UserGrade = string;
export type WorkSchedule = string;
export type ShiftPreference = string;
export type UserRole = string;

export interface User {
    id: string;
    fullName: string;
    department: DepartmentCode | null;
    position: PositionCode | null;
    grade: UserGrade | null;
    workSchedule: WorkSchedule | null;
    shiftPreference: ShiftPreference | null;
    email?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthDate?: string;
    phoneNumber?: string;
    tgLink?: string;
    role?: UserRole;
}

export type UserPageDto = User

export interface UserProfileType {
    id: string;
    email: string;
    role: UserRole;
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
        department: DepartmentCode | null;
        position: PositionCode | null;
        grade: UserGrade | null;
        workSchedule: WorkSchedule | null;
        shiftPreference: ShiftPreference | null;
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
    role?: UserRole;
    grade?: UserGrade;
    shiftPreference?: ShiftPreference;
    workSchedule?: WorkSchedule;
    department?: DepartmentCode;
    position?: PositionCode;
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
    department?: DepartmentCode;
    position?: PositionCode;
    workSchedule?: WorkSchedule;
    shiftPreference?: ShiftPreference;
    grade?: UserGrade;
}

export interface ChangeOwnPasswordDto {
    oldPassword: string;
    newPassword: string;
}

export interface AdminChangePasswordDto {
    newPassword: string;
}

export interface FindUsersDto {
    department?: DepartmentCode;  // Код отдела
    position?: PositionCode;    // Код позиции
    grade?: UserGrade;
    workSchedule?: WorkSchedule;
    shiftPreference?: ShiftPreference;
    page?: number;
}

// Тип для фильтров в UI (хранит коды, но отображаются названия)
export interface FilterState {
    department: DepartmentCode | '';   // Код отдела или пустая строка
    position: PositionCode | '';       // Код позиции или пустая строка
    grade: UserGrade | '';
    scheduleType: WorkSchedule | '';
    shiftType: ShiftPreference | '';
}

// Тип для мягкого удаления пользователя
export interface DeleteUserDto {
    isDeleted: boolean;
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

export interface WorkScheduleItem {
    id: string;
    code: WorkSchedule;
    name: string;
    isActive: boolean;
}

export interface ShiftPreferenceItem {
    id: string;
    code: ShiftPreference;
    name: string;
    isActive: boolean;
}

export interface GradeItem {
    id: string;
    code: UserGrade;
    name: string;
    isActive: boolean;
}

export interface CompanyStructurePosition {
    id: string;
    code: PositionCode;
    name: string;
    isActive: boolean;
    workSchedule: WorkScheduleItem;
    shiftPreferences: ShiftPreferenceItem[];
    grades: GradeItem[];
}

export interface CompanyStructureDepartment {
    id: string;
    code: DepartmentCode;
    name: string;
    isActive: boolean;
    positions: CompanyStructurePosition[];
    grades: GradeItem[]; // грейды, относящиеся к отделу
}

export interface CompanyStructureResponse {
    data: CompanyStructureDepartment[];
    positions: Array<{ code: string; name: string }>; // плоский список всех позиций
    grades: Array<{ code: string; name: string }>;    // плоский список всех грейдов
}

// Старые типы для обратной совместимости (можно будет удалить после обновления всех компонентов)
// Удаляем, так как больше не используются
// export interface Position {
//     code: string;
//     name: string;
// }
//
// export interface CompanyStructureItem {
//     code: string;
//     name: string;
//     positions: Position[];
// }

export interface UserSliceType {
    users: User[];
    currentUser: UserPageDto | null;
    currentUserProfile: UserProfileType | null;
    companyStructure: CompanyStructureResponse | null; // теперь храним весь ответ
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
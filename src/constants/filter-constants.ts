// Константы для фильтров пользователей
export interface DepartmentData {
    id: string;
    name: string;
    positions: string[];
    grades: string[];
}

// Данные о связи отделов с позициями и грейдами
export const DEPARTMENTS_DATA: DepartmentData[] = [
    {
        id: 'all',
        name: 'Все',
        positions: ['Фронт разработчик', 'Бек разработчик', 'Фул стак', 'Квалити менеджер', 'Старший саппорт', 'Младший саппорт'],
        grades: ['Junior', 'Middle', 'Senior']
    },
    {
        id: 'IT',
        name: 'IT',
        positions: ['Бек разработчик', 'Фронт разработчик', 'Фул стак'],
        grades: ['Junior', 'Middle', 'Senior']
    },
    {
        id: 'Support',
        name: 'Support',
        positions: ['Старший саппорт', 'Младший саппорт'],
        grades: ['Junior', 'Middle']
    },
    {
        id: 'Sales',
        name: 'Sales',
        positions: ['Менеджер', 'Потичск'],
        grades: ['Junior', 'Middle', 'Senior']
    }
];

// Все возможные отделы для селекта (без "Все", так как оно представлено пустой строкой)
export const ALL_DEPARTMENTS = DEPARTMENTS_DATA.filter(dept => dept.id !== 'all').map(dept => dept.name);

// Все возможные позиции (уникальные)
export const ALL_POSITIONS = Array.from(new Set(DEPARTMENTS_DATA.flatMap(dept => dept.positions)));

// Все возможные грейды (уникальные)
export const ALL_GRADES = Array.from(new Set(DEPARTMENTS_DATA.flatMap(dept => dept.grades)));

// Типы графиков и смен (остаются как были)
export const SCHEDULE_TYPES = ['Стандартный', 'Сменный'];
export const SHIFT_TYPES = ['Дневная', 'Любая', 'Ночная'];
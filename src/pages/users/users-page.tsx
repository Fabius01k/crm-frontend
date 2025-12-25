import { useState, useMemo } from 'react';
import { UsersFilterForm } from './users-filter-form';
import { UserSearchForm } from './user-search-form';
import styles from './users-page.module.scss';

interface User {
    id: number;
    fullName: string;
    department: string;
    position: string;
    grade: string;
    scheduleType: string;
    shiftType: string;
}

interface FilterState {
    department: string;
    position: string;
    grade: string;
    scheduleType: string;
    shiftType: string;
}

export const UsersPage = () => {
    const allUsers: User[] = [
        // IT отдел
        { id: 1, fullName: 'Алексей Иванов', department: 'IT', position: 'Фронт разработчик', grade: 'Junior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 2, fullName: 'Ольга Смирнова', department: 'IT', position: 'Бек разработчик', grade: 'Middle', scheduleType: 'Сменный', shiftType: 'Любая' },
        { id: 3, fullName: 'Даниил Петров', department: 'IT', position: 'Фул стак', grade: 'Senior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 4, fullName: 'Елена Козлова', department: 'IT', position: 'Фронт разработчик', grade: 'Middle', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        // Support отдел
        { id: 5, fullName: 'Сергей Сидоров', department: 'Support', position: 'Старший саппорт', grade: 'Senior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 6, fullName: 'Анна Михайлова', department: 'Support', position: 'Младший саппорт', grade: 'Junior', scheduleType: 'Сменный', shiftType: 'Ночная' },
        { id: 7, fullName: 'Иван Орлов', department: 'Support', position: 'Старший саппорт', grade: 'Middle', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        // Sales отдел
        { id: 8, fullName: 'Мария Петрова', department: 'Sales', position: 'Менеджер', grade: 'Junior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 9, fullName: 'Дмитрий Соколов', department: 'Sales', position: 'Потичск', grade: 'Middle', scheduleType: 'Сменный', shiftType: 'Любая' },
        // { id: 10, fullName: 'Наталья Волкова', department: 'Sales', position: 'Менеджер', grade: 'Senior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
    ];

    const [filters, setFilters] = useState<FilterState>({
        department: '',
        position: '',
        grade: '',
        scheduleType: '',
        shiftType: '',
    });

    const [searchQuery, setSearchQuery] = useState('');

    // Функция для получения доступных значений фильтров на основе текущих фильтров и данных пользователей
    const availableFilterOptions = useMemo(() => {
        // Начинаем с полного списка пользователей
        let filtered = allUsers;

        // Применяем текущие фильтры по очереди, исключая поле, для которого вычисляем
        // Для каждого поля вычисляем уникальные значения из отфильтрованного списка

        // Доступные отделы
        const departments = Array.from(new Set(filtered.map(user => user.department)));

        // Доступные позиции с учетом выбранного отдела и грейда (если выбраны)
        let positionsFiltered = filtered;
        if (filters.department) {
            positionsFiltered = positionsFiltered.filter(user => user.department === filters.department);
        }
        if (filters.grade) {
            positionsFiltered = positionsFiltered.filter(user => user.grade === filters.grade);
        }
        const positions = Array.from(new Set(positionsFiltered.map(user => user.position)));

        // Доступные грейды с учетом выбранного отдела и позиции
        let gradesFiltered = filtered;
        if (filters.department) {
            gradesFiltered = gradesFiltered.filter(user => user.department === filters.department);
        }
        if (filters.position) {
            gradesFiltered = gradesFiltered.filter(user => user.position === filters.position);
        }
        const grades = Array.from(new Set(gradesFiltered.map(user => user.grade)));

        // Доступные типы графиков и смен (не зависят от других фильтров, но можно тоже ограничить)
        const scheduleTypes = Array.from(new Set(filtered.map(user => user.scheduleType)));
        const shiftTypes = Array.from(new Set(filtered.map(user => user.shiftType)));

        return {
            departments: ['', ...departments],
            positions: ['', ...positions],
            grades: ['', ...grades],
            scheduleTypes: ['', ...scheduleTypes],
            shiftTypes: ['', ...shiftTypes],
        };
    }, [filters, allUsers]);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            // Поиск по ФИО (регистронезависимый)
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const fullName = user.fullName.toLowerCase();
                if (!fullName.includes(query)) {
                    return false;
                }
            }

            // Фильтры по остальным полям
            if (filters.department && user.department !== filters.department) return false;
            if (filters.position && user.position !== filters.position) return false;
            if (filters.grade && user.grade !== filters.grade) return false;
            if (filters.scheduleType && user.scheduleType !== filters.scheduleType) return false;
            if (filters.shiftType && user.shiftType !== filters.shiftType) return false;
            return true;
        });
    }, [filters, searchQuery]);

    const handleApplyFilters = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setFilters({
            department: '',
            position: '',
            grade: '',
            scheduleType: '',
            shiftType: '',
        });
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className={styles.container}>
            <h2>Пользователи</h2>
            {allUsers && allUsers.length > 0 && (
                <div>Всего пользователей: {allUsers.length}</div>
            )}
            <UserSearchForm onSearch={handleSearch} />
            <UsersFilterForm
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                availableOptions={availableFilterOptions}
            />
            <table className={styles.table}>
                <thead>
                    <tr className={styles.header}>
                        <th className={styles.headerCell}>ФИО</th>
                        <th className={styles.headerCell}>Отдел</th>
                        <th className={styles.headerCell}>Позиция</th>
                        <th className={styles.headerCell}>Грейд</th>
                        <th className={styles.headerCell}>Тип графика</th>
                        <th className={styles.headerCell}>Тип смены</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className={styles.row}>
                            <td className={styles.cell}>{user.fullName}</td>
                            <td className={styles.cell}>{user.department}</td>
                            <td className={styles.cell}>{user.position}</td>
                            <td className={styles.cell}>{user.grade}</td>
                            <td className={styles.cell}>{user.scheduleType}</td>
                            <td className={styles.cell}>{user.shiftType}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
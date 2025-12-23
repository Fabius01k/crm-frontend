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
        { id: 1, fullName: 'Алексей Иванов', department: 'Support', position: 'Менеджер', grade: 'Junior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 2, fullName: 'Ольга Смирнова', department: 'Support', position: 'Менеджер', grade: 'Middle', scheduleType: 'Сменный', shiftType: 'Любая' },
        { id: 3, fullName: 'Даниил Петров', department: 'Sales', position: 'Менеджер', grade: 'Junior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 4, fullName: 'Елена Козлова', department: 'Sales', position: 'Потичск', grade: 'Middle', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 5, fullName: 'Сергей Сидоров', department: 'Support', position: 'Менеджер', grade: 'Senior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
        { id: 6, fullName: 'Анна Михайлова', department: 'Support', position: 'Менеджер', grade: 'Senior', scheduleType: 'Сменный', shiftType: 'Ночная' },
        { id: 7, fullName: 'Иван Орлов', department: 'Sales', position: 'Менеджер', grade: 'Senior', scheduleType: 'Стандартный', shiftType: 'Дневная' },
    ];

    const [filters, setFilters] = useState<FilterState>({
        department: '',
        position: '',
        grade: '',
        scheduleType: '',
        shiftType: '',
    });

    const [searchQuery, setSearchQuery] = useState('');

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
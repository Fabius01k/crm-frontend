import { useState, useMemo, useEffect, useRef } from 'react';
import { UsersFilterForm } from './users-filter-form';
import { UserSearchForm } from './user-search-form';
import styles from './users-page.module.scss';
import { useAppDispatch, useAppSelector } from '@store/store';
import { userThunks } from '@store/features/user-slice/user-thunks';
import { userSliceActions } from '@store/features/user-slice/user-slice';

interface FilterState {
    department: string;
    position: string;
    grade: string;
    scheduleType: string;
    shiftType: string;
}

export const UsersPage = () => {
    const dispatch = useAppDispatch();
    const { users, loading, error, pagination, searchQuery } = useAppSelector((state) => state.user);

    const [filters, setFilters] = useState<FilterState>({
        department: '',
        position: '',
        grade: '',
        scheduleType: '',
        shiftType: '',
    });

    const [currentPage, setCurrentPage] = useState(1);

    const prevFilters = useRef(filters);
    const prevSearchQuery = useRef(searchQuery);
    const prevPage = useRef(currentPage);
    const isInitialMount = useRef(true);

    // Эффект для загрузки пользователей
    useEffect(() => {
        const filtersChanged =
            prevFilters.current.department !== filters.department ||
            prevFilters.current.position !== filters.position ||
            prevFilters.current.grade !== filters.grade ||
            prevFilters.current.scheduleType !== filters.scheduleType ||
            prevFilters.current.shiftType !== filters.shiftType;
        const searchChanged = prevSearchQuery.current !== searchQuery;

        // Если это первый рендер, просто загружаем данные
        if (isInitialMount.current) {
            isInitialMount.current = false;
            const params = {
                department: filters.department || undefined,
                position: filters.position || undefined,
                grade: filters.grade || undefined,
                workSchedule: filters.scheduleType || undefined,
                preferredShiftType: filters.shiftType || undefined,
                page: currentPage,
            };
            dispatch(userThunks.fetchUsers(params));
            prevFilters.current = filters;
            prevSearchQuery.current = searchQuery;
            prevPage.current = currentPage;
            return;
        }

        // Определяем, какой запрос делать
        if (searchQuery.trim().length >= 2) {
            // При поиске игнорируем пагинацию
            dispatch(userThunks.searchUsers(searchQuery.trim()));
        } else {
            const pageToLoad = (filtersChanged || searchChanged) ? 1 : currentPage;
            const params = {
                department: filters.department || undefined,
                position: filters.position || undefined,
                grade: filters.grade || undefined,
                workSchedule: filters.scheduleType || undefined,
                preferredShiftType: filters.shiftType || undefined,
                page: pageToLoad,
            };
            dispatch(userThunks.fetchUsers(params));
        }

        // Обновляем предыдущие значения
        prevFilters.current = filters;
        prevSearchQuery.current = searchQuery;
        prevPage.current = currentPage;
    }, [dispatch, filters, searchQuery, currentPage]);

    // Преобразование пользователей из API в формат компонента
    const transformedUsers = useMemo(() => {
        return users.map((user) => ({
            id: Number(user.id) || 0,
            fullName: user.fullName,
            department: user.department || '',
            position: user.position || '',
            grade: user.grade || '',
            scheduleType: user.workSchedule || '',
            shiftType: user.preferredShiftType || '',
        }));
    }, [users]);

    // Функция для получения доступных значений фильтров на основе текущих фильтров и данных пользователей
    const availableFilterOptions = useMemo(() => {
        const filtered = transformedUsers;

        const departments = Array.from(new Set(filtered.map(user => user.department)));

        let positionsFiltered = filtered;
        if (filters.department) {
            positionsFiltered = positionsFiltered.filter(user => user.department === filters.department);
        }
        if (filters.grade) {
            positionsFiltered = positionsFiltered.filter(user => user.grade === filters.grade);
        }
        const positions = Array.from(new Set(positionsFiltered.map(user => user.position)));

        let gradesFiltered = filtered;
        if (filters.department) {
            gradesFiltered = gradesFiltered.filter(user => user.department === filters.department);
        }
        if (filters.position) {
            gradesFiltered = gradesFiltered.filter(user => user.position === filters.position);
        }
        const grades = Array.from(new Set(gradesFiltered.map(user => user.grade)));

        const scheduleTypes = Array.from(new Set(filtered.map(user => user.scheduleType)));
        const shiftTypes = Array.from(new Set(filtered.map(user => user.shiftType)));

        return {
            departments: ['', ...departments],
            positions: ['', ...positions],
            grades: ['', ...grades],
            scheduleTypes: ['', ...scheduleTypes],
            shiftTypes: ['', ...shiftTypes],
        };
    }, [filters, transformedUsers]);

    const filteredUsers = useMemo(() => {
        return transformedUsers.filter(user => {
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const fullName = user.fullName.toLowerCase();
                if (!fullName.includes(query)) {
                    return false;
                }
            }

            if (filters.department && user.department !== filters.department) return false;
            if (filters.position && user.position !== filters.position) return false;
            if (filters.grade && user.grade !== filters.grade) return false;
            if (filters.scheduleType && user.scheduleType !== filters.scheduleType) return false;
            return !(filters.shiftType && user.shiftType !== filters.shiftType);
        });
    }, [transformedUsers, filters.department, filters.grade, filters.position, filters.scheduleType, filters.shiftType, searchQuery]);

    const handleApplyFilters = (newFilters: FilterState) => {
        // Если фильтры изменились, сбрасываем страницу на 1
        if (
            newFilters.department !== filters.department ||
            newFilters.position !== filters.position ||
            newFilters.grade !== filters.grade ||
            newFilters.scheduleType !== filters.scheduleType ||
            newFilters.shiftType !== filters.shiftType
        ) {
            setCurrentPage(1);
        }
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
        dispatch(userSliceActions.setSearchQuery(''));
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <div className={styles.container}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.container}>Ошибка: {error}</div>;
    }

    const showPagination = pagination && pagination.totalPages > 1 && searchQuery.trim().length < 2;

    return (
        <div className={styles.container}>
            {/*<h2>Пользователи</h2>*/}
            {transformedUsers && transformedUsers.length > 0 && (
                <div>Всего пользователей: {pagination?.total ?? transformedUsers.length}</div>
            )}
            <UserSearchForm />
            <UsersFilterForm
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                currentFilters={filters}
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

            {showPagination && (
                <div className={styles.pagination}>
                    <button
                        className={styles.paginationButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Назад
                    </button>
                    <span className={styles.paginationInfo}>
                        Страница {currentPage} из {pagination.totalPages}
                    </span>
                    <button
                        className={styles.paginationButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
};
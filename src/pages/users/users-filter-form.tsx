import { type ChangeEvent, useState } from 'react';
import arrowIcon from '@assets/icons/arrow.svg';
import styles from './users-page.module.scss';

interface FilterState {
    department: string;
    position: string;
    grade: string;
    scheduleType: string;
    shiftType: string;
}

interface UsersFilterFormProps {
    onApplyFilters: (filters: FilterState) => void;
    onResetFilters: () => void;
}

export const UsersFilterForm = ({ onApplyFilters, onResetFilters }: UsersFilterFormProps) => {
    const [filters, setFilters] = useState<FilterState>({
        department: '',
        position: '',
        grade: '',
        scheduleType: '',
        shiftType: '',
    });

    const [focusedSelectId, setFocusedSelectId] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFocus = (id: string) => {
        setFocusedSelectId(id);
    };

    const handleBlur = () => {
        setFocusedSelectId(null);
    };

    const handleApply = () => {
        onApplyFilters(filters);
    };

    const handleReset = () => {
        setFilters({
            department: '',
            position: '',
            grade: '',
            scheduleType: '',
            shiftType: '',
        });
        onResetFilters();
    };

    // Возможные значения для фильтров (можно вынести в константы)
    const departments = ['', 'Support', 'Sales'];
    const positions = ['', 'Менеджер', 'Потичск'];
    const grades = ['', 'Junior', 'Middle', 'Senior'];
    const scheduleTypes = ['', 'Стандартный', 'Сменный'];
    const shiftTypes = ['', 'Дневная', 'Любая', 'Ночная'];

    const isFocused = (id: string) => focusedSelectId === id;

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterRow}>
                <div className={styles.filterGroup}>
                    <label htmlFor="department">Отдел</label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="department"
                            name="department"
                            value={filters.department}
                            onChange={handleChange}
                            onFocus={() => handleFocus('department')}
                            onBlur={handleBlur}
                            className={styles.filterSelect}
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>
                                    {dept || 'Все'}
                                </option>
                            ))}
                        </select>
                        <img
                            src={arrowIcon}
                            alt=""
                            className={`${styles.selectIcon} ${isFocused('department') ? styles.selectIconRotated : ''}`}
                        />
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="position">Позиция</label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="position"
                            name="position"
                            value={filters.position}
                            onChange={handleChange}
                            onFocus={() => handleFocus('position')}
                            onBlur={handleBlur}
                            className={styles.filterSelect}
                        >
                            {positions.map(pos => (
                                <option key={pos} value={pos}>
                                    {pos || 'Все'}
                                </option>
                            ))}
                        </select>
                        <img
                            src={arrowIcon}
                            alt=""
                            className={`${styles.selectIcon} ${isFocused('position') ? styles.selectIconRotated : ''}`}
                        />
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="grade">Грейд</label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="grade"
                            name="grade"
                            value={filters.grade}
                            onChange={handleChange}
                            onFocus={() => handleFocus('grade')}
                            onBlur={handleBlur}
                            className={styles.filterSelect}
                        >
                            {grades.map(grade => (
                                <option key={grade} value={grade}>
                                    {grade || 'Все'}
                                </option>
                            ))}
                        </select>
                        <img
                            src={arrowIcon}
                            alt=""
                            className={`${styles.selectIcon} ${isFocused('grade') ? styles.selectIconRotated : ''}`}
                        />
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="scheduleType">Тип графика</label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="scheduleType"
                            name="scheduleType"
                            value={filters.scheduleType}
                            onChange={handleChange}
                            onFocus={() => handleFocus('scheduleType')}
                            onBlur={handleBlur}
                            className={styles.filterSelect}
                        >
                            {scheduleTypes.map(type => (
                                <option key={type} value={type}>
                                    {type || 'Все'}
                                </option>
                            ))}
                        </select>
                        <img
                            src={arrowIcon}
                            alt=""
                            className={`${styles.selectIcon} ${isFocused('scheduleType') ? styles.selectIconRotated : ''}`}
                        />
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="shiftType">Тип смены</label>
                    <div className={styles.selectWrapper}>
                        <select
                            id="shiftType"
                            name="shiftType"
                            value={filters.shiftType}
                            onChange={handleChange}
                            onFocus={() => handleFocus('shiftType')}
                            onBlur={handleBlur}
                            className={styles.filterSelect}
                        >
                            {shiftTypes.map(type => (
                                <option key={type} value={type}>
                                    {type || 'Все'}
                                </option>
                            ))}
                        </select>
                        <img
                            src={arrowIcon}
                            alt=""
                            className={`${styles.selectIcon} ${isFocused('shiftType') ? styles.selectIconRotated : ''}`}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.buttonRow}>
                <button type="button" className={styles.filterButton} onClick={handleApply}>
                    Применить
                </button>
                <button type="button" className={styles.filterButton} onClick={handleReset}>
                    Сбросить
                </button>
            </div>
        </div>
    );
};
import { type ChangeEvent, useState, useEffect, useMemo, useRef } from 'react';
import arrowIcon from '@assets/icons/arrow.svg';
import styles from './users-page.module.scss';
import type { FilterState, CompanyStructureResponse } from '@store/features/user-slice/user-types';
import { getFilteredPositions, getFilteredGrades } from '../../common/utils/company-structure-filters';

interface UsersFilterFormProps {
    onApplyFilters: (filters: FilterState) => void;
    onResetFilters: () => void;
    currentFilters?: FilterState;
    availableOptions?: {
        departments: Array<{ code: string; name: string }>;
        positions: Array<{ code: string; name: string }>;
        grades: Array<{ value: string; label: string }>;
        scheduleTypes: Array<{ value: string; label: string }>;
        shiftTypes: Array<{ value: string; label: string }>;
    };
    companyStructure?: CompanyStructureResponse;
}

export const UsersFilterForm = ({ onApplyFilters, onResetFilters, currentFilters, availableOptions, companyStructure }: UsersFilterFormProps) => {
    const [filters, setFilters] = useState<FilterState>(currentFilters || {
        department: '',
        position: '',
        grade: '',
        scheduleType: '',
        shiftType: '',
    });

    const [focusedSelectId, setFocusedSelectId] = useState<string | null>(null);

    // Синхронизация локального состояния с переданными фильтрами из родителя
    const prevFiltersRef = useRef<FilterState | undefined>(currentFilters);
    useEffect(() => {
        if (currentFilters && currentFilters !== prevFiltersRef.current) {
            setFilters(currentFilters);
            prevFiltersRef.current = currentFilters;
        }
    }, [currentFilters]);

    // Используем переданные доступные варианты или fallback на пустые массивы
    const {
        departments = [{ code: '', name: '' }],
        positions = [{ code: '', name: '' }],
        grades = [{ value: '', label: 'Все' }],
        scheduleTypes = [{ value: '', label: 'Все' }],
        shiftTypes = [{ value: '', label: 'Все' }]
    } = availableOptions || {};

    // Локальная константа для типа графика (можно вынести в общий файл, но пока здесь)
    const WORK_SCHEDULE = {
        DEFAULT: 'default',
        SHIFT_SCHEDULE: 'shift_schedule',
    } as const;

    // Вычисляем позиции на основе структуры компании и выбранного отдела
    const computedPositions = useMemo(() => {
        return getFilteredPositions(companyStructure, filters.department, positions);
    }, [companyStructure, filters.department, positions]);

    // Вычисляем грейды на основе структуры компании, выбранного отдела и позиции
    const computedGrades = useMemo(() => {
        return getFilteredGrades(companyStructure, filters.department, filters.position, grades);
    }, [companyStructure, filters.department, filters.position, grades]);

    const showShiftType = filters.scheduleType === WORK_SCHEDULE.SHIFT_SCHEDULE;

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };

            // Если изменился отдел, сбрасываем позицию и грейд, если они больше не доступны
            if (name === 'department') {
                // Получаем доступные позиции и грейды для нового отдела из availableOptions
                // (это будет обработано на уровне родителя, здесь просто сбрасываем)
                // Проверяем, если текущая позиция не входит в доступные для нового отдела, сбрасываем
                // Поскольку мы не знаем доступные позиции здесь, просто сбрасываем всегда
                // (более точная логика будет в родительском компоненте)
                newFilters.position = '';
                newFilters.grade = '';
            }
            // Если изменилась позиция, сбрасываем грейд, если он не доступен для новой позиции
            if (name === 'position') {
                newFilters.grade = '';
            }
            // Если изменился тип графика и выбран не сменный график, сбрасываем тип смены
            if (name === 'scheduleType' && value !== WORK_SCHEDULE.SHIFT_SCHEDULE) {
                newFilters.shiftType = '';
            }

            return newFilters;
        });
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
                            {[{ code: '', name: 'Все' }, ...departments.filter(dept => dept.code !== '')].map(dept => (
                                <option key={dept.code} value={dept.code}>
                                    {dept.name}
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
                            {[{ code: '', name: 'Все' }, ...computedPositions].map(pos => (
                                <option key={pos.code} value={pos.code}>
                                    {pos.name}
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
                            {[{ code: '', name: 'Все' }, ...computedGrades].map(grade => (
                                <option key={grade.code} value={grade.code}>
                                    {grade.name}
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
                            {scheduleTypes.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
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
                            disabled={!showShiftType}
                        >
                            {shiftTypes.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
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
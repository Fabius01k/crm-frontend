import { type ChangeEvent, useState, useEffect, useMemo } from 'react';
import arrowIcon from '@assets/icons/arrow.svg';
import styles from './users-page.module.scss';
import type { FilterState, CompanyStructureItem } from '@store/features/user-slice/user-types';

interface UsersFilterFormProps {
    onApplyFilters: (filters: FilterState) => void;
    onResetFilters: () => void;
    currentFilters?: FilterState;
    availableOptions?: {
        departments: Array<{ code: string; name: string }>;
        positions: Array<{ code: string; name: string }>;
        grades: string[];
        scheduleTypes: string[];
        shiftTypes: string[];
    };
    companyStructure?: CompanyStructureItem[];
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
    useEffect(() => {
        if (currentFilters) {
            setFilters(currentFilters);
        }
    }, [currentFilters]);

    // Используем переданные доступные варианты или fallback на пустые массивы
    const {
        departments = [{ code: '', name: '' }],
        positions = [{ code: '', name: '' }],
        grades = [''],
        scheduleTypes = [''],
        shiftTypes = ['']
    } = availableOptions || {};

    // Вычисляем позиции на основе структуры компании и выбранного отдела
    const computedPositions = useMemo(() => {
        if (companyStructure && companyStructure.length > 0) {
            if (filters.department) {
                // Ищем отдел по коду
                const selectedDept = companyStructure.find(dept => dept.code === filters.department);
                if (selectedDept) {
                    return selectedDept.positions;
                }
            } else {
                // Все уникальные позиции из всех отделов без повторений
                const allPositions = companyStructure.flatMap(dept => dept.positions);
                // Убираем дубликаты по коду
                const uniquePositions = allPositions.reduce((acc, pos) => {
                    if (!acc.some(p => p.code === pos.code)) {
                        acc.push(pos);
                    }
                    return acc;
                }, [] as Array<{ code: string; name: string }>);
                return uniquePositions;
            }
        }
        // Fallback к переданным позициям
        return positions;
    }, [companyStructure, filters.department, positions]);

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
            // Если изменился грейд, сбрасываем позицию? Нет, оставляем как есть.

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
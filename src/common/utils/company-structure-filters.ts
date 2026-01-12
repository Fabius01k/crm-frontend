import type { CompanyStructureResponse, CompanyStructureDepartment, CompanyStructurePosition, GradeItem } from '@store/features/user-slice/user-types';

/**
 * Получить позиции на основе структуры компании и выбранного отдела
 * @param companyStructure - структура компании
 * @param selectedDepartmentCode - код выбранного отдела (пустая строка если не выбран)
 * @param fallbackPositions - резервный массив позиций (если структура компании не загружена)
 * @returns Массив позиций для отображения
 */
export function getFilteredPositions(
    companyStructure: CompanyStructureResponse | null | undefined,
    selectedDepartmentCode: string,
    fallbackPositions: Array<{ code: string; name: string }> = []
): Array<{ code: string; name: string }> {
    if (!companyStructure || !companyStructure.data.length) {
        return fallbackPositions;
    }

    if (selectedDepartmentCode) {
        // Ищем отдел по коду
        const selectedDept = companyStructure.data.find(dept => dept.code === selectedDepartmentCode);
        if (selectedDept) {
            return selectedDept.positions.map(pos => ({ code: pos.code, name: pos.name })) || [];
        }
        return [];
    } else {
        // Все уникальные позиции из всех отделов без повторений
        const allPositions = companyStructure.data.flatMap(dept => 
            dept.positions.map(pos => ({ code: pos.code, name: pos.name }))
        );
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

/**
 * Получить грейды на основе структуры компании, выбранного отдела и позиции
 * @param companyStructure - структура компании
 * @param selectedDepartmentCode - код выбранного отдела (пустая строка если не выбран)
 * @param selectedPositionCode - код выбранной позиции (пустая строка если не выбрана)
 * @param fallbackGrades - резервный массив грейдов (если структура компании не загружена)
 * @returns Массив грейдов для отображения
 */
export function getFilteredGrades(
    companyStructure: CompanyStructureResponse | null | undefined,
    selectedDepartmentCode: string,
    selectedPositionCode: string,
    fallbackGrades: Array<{ value: string; label: string }> = []
): Array<{ code: string; name: string }> {
    if (!companyStructure || !companyStructure.data.length) {
        // Fallback к переданным грейдам
        return fallbackGrades.map(g => ({ code: g.value, name: g.label }));
    }

    // Если выбрана позиция - грейды этой позиции
    if (selectedPositionCode) {
        for (const dept of companyStructure.data) {
            const pos = dept.positions.find(p => p.code === selectedPositionCode);
            if (pos && pos.grades && pos.grades.length > 0) {
                return pos.grades;
            }
        }
        // Если у позиции нет грейдов, показываем все грейды из плоского списка
        if (companyStructure.grades) {
            return companyStructure.grades.map(g => ({ code: g.code, name: g.name }));
        }
        return [];
    }

    // Если выбран отдел (но не позиция) - собираем все уникальные грейды из всех позиций отдела
    if (selectedDepartmentCode) {
        const dept = companyStructure.data.find(d => d.code === selectedDepartmentCode);
        if (dept) {
            // Собираем все грейды из всех позиций отдела
            const allGrades = dept.positions.flatMap(pos => pos.grades || []);
            // Убираем дубликаты по коду
            const uniqueGrades = allGrades.reduce((acc, grade) => {
                if (!acc.some(g => g.code === grade.code)) {
                    acc.push(grade);
                }
                return acc;
            }, [] as typeof allGrades);
            
            if (uniqueGrades.length > 0) {
                return uniqueGrades;
            }
        }
        // Если в отделе нет позиций с грейдами, показываем все грейды из плоского списка
        if (companyStructure.grades) {
            return companyStructure.grades.map(g => ({ code: g.code, name: g.name }));
        }
        return [];
    }

    // Если ничего не выбрано - все грейды из плоского списка
    if (companyStructure.grades) {
        return companyStructure.grades.map(g => ({ code: g.code, name: g.name }));
    }

    return [];
}

/**
 * Получить все отделы из структуры компании
 * @param companyStructure - структура компании
 * @returns Массив отделов для отображения
 */
export function getDepartments(
    companyStructure: CompanyStructureResponse | null | undefined
): Array<{ code: string; name: string }> {
    if (!companyStructure || !companyStructure.data.length) {
        return [];
    }
    return companyStructure.data.map(dept => ({ code: dept.code, name: dept.name }));
}

/**
 * Получить все уникальные грейды из плоского списка компании
 * @param companyStructure - структура компании
 * @returns Массив грейдов для отображения
 */
export function getAllGrades(
    companyStructure: CompanyStructureResponse | null | undefined
): Array<{ code: string; name: string }> {
    if (!companyStructure || !companyStructure.grades) {
        return [];
    }
    return companyStructure.grades.map(g => ({ code: g.code, name: g.name }));
}

/**
 * Найти позицию по коду в структуре компании
 * @param companyStructure - структура компании
 * @param positionCode - код позиции
 * @returns Позиция или undefined если не найдена
 */
export function findPositionByCode(
    companyStructure: CompanyStructureResponse | null | undefined,
    positionCode: string
): CompanyStructurePosition | undefined {
    if (!companyStructure || !companyStructure.data.length || !positionCode) {
        return undefined;
    }
    
    for (const dept of companyStructure.data) {
        const pos = dept.positions.find(p => p.code === positionCode);
        if (pos) {
            return pos;
        }
    }
    return undefined;
}

/**
 * Найти отдел по коду в структуре компании
 * @param companyStructure - структура компании
 * @param departmentCode - код отдела
 * @returns Отдел или undefined если не найден
 */
export function findDepartmentByCode(
    companyStructure: CompanyStructureResponse | null | undefined,
    departmentCode: string
): CompanyStructureDepartment | undefined {
    if (!companyStructure || !companyStructure.data.length || !departmentCode) {
        return undefined;
    }
    
    return companyStructure.data.find(dept => dept.code === departmentCode);
}
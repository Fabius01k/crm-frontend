import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@store/store';
import { userThunks } from '@store/features/user-slice/user-thunks';
import type { CreateUserDto } from '@store/features/user-slice/user-types';
import styles from './CreateUserModal.module.scss';
import { getFilteredPositions, getFilteredGrades } from '../../common/utils/company-structure-filters';
import {
  WorkScheduleEnum,
  ShiftPreferenceEnum,
  UserRoleEnum,
  WorkScheduleLabels,
  ShiftPreferenceLabels,
  UserRoleLabels,
} from '../../common/enums/enums';
import PasswordInputWithGeneration from '../password-input/PasswordInputWithGeneration';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateUserModal = ({ isOpen, onClose, onSuccess }: CreateUserModalProps) => {
    const dispatch = useAppDispatch();
    const { companyStructure, loading: userLoading } = useAppSelector((state) => state.user);

    const [formData, setFormData] = useState<CreateUserDto>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '', // Обязательное поле в API, но может быть пустой строкой
        phoneNumber: '',
        tgLink: '',
        role: 'EMPLOYEE',
        grade: undefined,
        shiftPreference: undefined,
        workSchedule: undefined,
        // department: '',
        // position: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availablePositions, setAvailablePositions] = useState<Array<{ code: string; name: string }>>([]);
    const [availableGrades, setAvailableGrades] = useState<Array<{ value: string; label: string }>>([]);

    // Фильтруем позиции в зависимости от выбранного отдела и грейда
    useEffect(() => {
        if (!companyStructure) {
            setAvailablePositions([]);
            return;
        }

        // Используем утилиту для получения отфильтрованных позиций
        const filteredPositions = getFilteredPositions(companyStructure, formData.department || '', []);

        // Дополнительная фильтрация по грейду, если выбран
        let finalPositions = filteredPositions;
        if (formData.grade && filteredPositions.length > 0) {
            // Находим полные объекты позиций для фильтрации по грейду
            const allPositions = companyStructure.data.flatMap(dept => dept.positions);
            const positionObjects = allPositions.filter(pos =>
                filteredPositions.some(fp => fp.code === pos.code)
            );
            
            finalPositions = positionObjects
                .filter(pos =>
                    pos.grades && pos.grades.some(grade => grade.code === formData.grade)
                )
                .map(pos => ({ code: pos.code, name: pos.name }));
        }

        setAvailablePositions(finalPositions);

        // Если текущая позиция не входит в доступные, сбрасываем её
        if (formData.position && !finalPositions.some(pos => pos.code === formData.position)) {
            setFormData(prev => ({ ...prev, position: '' }));
        }
    }, [formData.department, formData.grade, companyStructure]);

    // Фильтруем грейды в зависимости от выбранного отдела и позиции
    useEffect(() => {
        if (!companyStructure || !companyStructure.grades) {
            setAvailableGrades([]);
            return;
        }

        // Используем утилиту для получения отфильтрованных грейдов
        const filteredGrades = getFilteredGrades(
            companyStructure,
            formData.department || '',
            formData.position || '',
            []
        );

        // Преобразуем в формат для отображения
        const displayGrades = filteredGrades.map(g => ({ value: g.code, label: g.name }));

        setAvailableGrades(displayGrades);

        // Если текущий грейд не входит в доступные, сбрасываем его
        if (formData.grade && !displayGrades.some(g => g.value === formData.grade)) {
            setFormData(prev => ({ ...prev, grade: undefined }));
        }
    }, [formData.department, formData.position, companyStructure]);

    // Сбрасываем тип смены, если выбран не сменный график
    useEffect(() => {
        if (formData.workSchedule !== WorkScheduleEnum.SHIFT_SCHEDULE && formData.shiftPreference) {
            setFormData(prev => ({ ...prev, shiftPreference: undefined }));
        }
    }, [formData.workSchedule]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Очищаем ошибку для этого поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'Имя обязательно';
        if (!formData.lastName.trim()) newErrors.lastName = 'Фамилия обязательна';
        if (!formData.email.trim()) newErrors.email = 'Email обязателен';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Некорректный email';
        
        if (!formData.password) newErrors.password = 'Пароль обязателен';
        else if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
        
        if (!formData.department) newErrors.department = 'Отдел обязателен';
        if (!formData.position) newErrors.position = 'Позиция обязательна';
        if (!formData.grade) newErrors.grade = 'Грейд обязателен';
        if (!formData.workSchedule) newErrors.workSchedule = 'Тип графика обязателен';
        
        if (formData.workSchedule === WorkScheduleEnum.SHIFT_SCHEDULE && !formData.shiftPreference) {
            newErrors.shiftPreference = 'Тип смены обязателен для сменного графика';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(userThunks.createUser(formData)).unwrap();
            // Сброс формы
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                middleName: '',
                birthDate: '',
                phoneNumber: '',
                tgLink: '',
                role: 'EMPLOYEE',
                grade: undefined,
                shiftPreference: undefined,
                workSchedule: undefined,
                // department: '',
                // position: '',
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Ошибка создания пользователя:', error);
            // Можно добавить обработку ошибок API
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            middleName: '',
            birthDate: '',
            phoneNumber: '',
            tgLink: '',
            role: 'EMPLOYEE',
            grade: undefined,
            shiftPreference: undefined,
            workSchedule: undefined,
            // department: '',
            // position: '',
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    // Динамические опции из структуры компании
    const departmentOptions = companyStructure?.data || [];
    const gradeOptions = availableGrades.length > 0 ? availableGrades : (companyStructure?.grades.map(g => ({ value: g.code, label: g.name })) || []);

    // Константы для селектов (статические)
    const scheduleTypeOptions = [
        { value: WorkScheduleEnum.DEFAULT, label: WorkScheduleLabels[WorkScheduleEnum.DEFAULT] },
        { value: WorkScheduleEnum.SHIFT_SCHEDULE, label: WorkScheduleLabels[WorkScheduleEnum.SHIFT_SCHEDULE] },
    ];
    const shiftTypeOptions = [
        { value: ShiftPreferenceEnum.MORNING, label: ShiftPreferenceLabels[ShiftPreferenceEnum.MORNING] },
        { value: ShiftPreferenceEnum.DAY, label: ShiftPreferenceLabels[ShiftPreferenceEnum.DAY] },
        { value: ShiftPreferenceEnum.NIGHT, label: ShiftPreferenceLabels[ShiftPreferenceEnum.NIGHT] },
        { value: ShiftPreferenceEnum.MIXED, label: ShiftPreferenceLabels[ShiftPreferenceEnum.MIXED] },
    ];
    const roleOptions = [
        { value: UserRoleEnum.EMPLOYEE, label: UserRoleLabels[UserRoleEnum.EMPLOYEE] },
        { value: UserRoleEnum.TEAMLEAD, label: UserRoleLabels[UserRoleEnum.TEAMLEAD] },
        { value: UserRoleEnum.INTERN, label: UserRoleLabels[UserRoleEnum.INTERN] },
    ];

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Создать пользователя</h3>
                    <button className={styles.closeButton} onClick={handleClose} aria-label="Закрыть">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Основная информация</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">Имя *</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={errors.firstName ? styles.inputError : ''}
                                    placeholder="Введите имя"
                                />
                                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Фамилия *</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={errors.lastName ? styles.inputError : ''}
                                    placeholder="Введите фамилию"
                                />
                                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="middleName">Отчество</label>
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleInputChange}
                                placeholder="Введите отчество"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="birthDate">Дата рождения</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="phoneNumber">Телефон</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="+7 (XXX) XXX-XX-XX"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? styles.inputError : ''}
                                placeholder="example@company.com"
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Рабочая информация</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="department">Отдел *</label>
                                <select
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className={errors.department ? styles.inputError : ''}
                                >
                                    <option value="">Выберите отдел</option>
                                    {departmentOptions.map((dept) => (
                                        <option key={dept.code} value={dept.code}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.department && <span className={styles.errorText}>{errors.department}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="position">Позиция *</label>
                                <select
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    className={errors.position ? styles.inputError : ''}
                                    disabled={!formData.department && availablePositions.length === 0}
                                >
                                    <option value="">Выберите позицию</option>
                                    {availablePositions.map((pos) => (
                                        <option key={pos.code} value={pos.code}>
                                            {pos.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.position && <span className={styles.errorText}>{errors.position}</span>}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="grade">Грейд *</label>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    className={errors.grade ? styles.inputError : ''}
                                >
                                    <option value="">Выберите грейд</option>
                                    {gradeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.grade && <span className={styles.errorText}>{errors.grade}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="workSchedule">Тип графика *</label>
                                <select
                                    id="workSchedule"
                                    name="workSchedule"
                                    value={formData.workSchedule}
                                    onChange={handleInputChange}
                                    className={errors.workSchedule ? styles.inputError : ''}
                                >
                                    <option value="">Выберите тип графика</option>
                                    {scheduleTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.workSchedule && <span className={styles.errorText}>{errors.workSchedule}</span>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="shiftPreference">Тип смены</label>
                            <select
                                id="shiftPreference"
                                name="shiftPreference"
                                value={formData.shiftPreference}
                                onChange={handleInputChange}
                                className={errors.shiftPreference ? styles.inputError : ''}
                                disabled={formData.workSchedule !== WorkScheduleEnum.SHIFT_SCHEDULE}
                            >
                                <option value="">Выберите тип смены</option>
                                {shiftTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.shiftPreference && <span className={styles.errorText}>{errors.shiftPreference}</span>}
                            {formData.workSchedule !== WorkScheduleEnum.SHIFT_SCHEDULE && (
                                <div className={styles.hint}>Доступно только для сменного графика</div>
                            )}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Другое</h4>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Пароль *</label>
                            <PasswordInputWithGeneration
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Введите пароль"
                                error={errors.password}
                                required
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.narrowFormGroup}`}>
                            <label htmlFor="role">Роль</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                {roleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="tgLink">Telegram ссылка</label>
                            <input
                                type="text"
                                id="tgLink"
                                name="tgLink"
                                value={formData.tgLink}
                                onChange={handleInputChange}
                                placeholder="@username"
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting || userLoading}
                        >
                            {isSubmitting ? 'Создание...' : 'Создать пользователя'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
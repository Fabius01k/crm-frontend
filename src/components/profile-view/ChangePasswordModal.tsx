import React, { useState } from 'react';
import styles from './profile-view.module.scss';
import PasswordInput from '../password-input/PasswordInput';
import PasswordInputWithGeneration from '../password-input/PasswordInputWithGeneration';

export interface ChangePasswordModalProps {
    // Данные пользователя, для которого меняется пароль
    userId?: string;
    userEmail?: string;
    userName?: string;
    // Это собственный профиль или чужой
    isOwnProfile: boolean;
    // Колбэки
    onClose: () => void;
    onSubmit: (data: {
        oldPassword?: string;
        newPassword: string;
        userId?: string;
    }) => void;
    // Состояние загрузки
    isLoading?: boolean;
    // Ошибка
    error?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    userId,
    userEmail,
    userName,
    isOwnProfile,
    onClose,
    onSubmit,
    isLoading = false,
    error,
}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        // Валидация
        if (newPassword.length < 8) {
            setValidationError('Новый пароль должен содержать минимум 8 символов');
            return;
        }

        if (isOwnProfile && !oldPassword) {
            setValidationError('Текущий пароль обязателен для смены собственного пароля');
            return;
        }

        // Проверка, что новый пароль не совпадает со старым (для собственного профиля)
        if (isOwnProfile && oldPassword === newPassword) {
            setValidationError('Новый пароль должен отличаться от текущего');
            return;
        }

        onSubmit({
            oldPassword: isOwnProfile ? oldPassword : undefined,
            newPassword,
            userId,
        });
    };

    const handleGeneratePassword = (password: string) => {
        setNewPassword(password);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h3>{isOwnProfile ? 'Смена моего пароля' : 'Смена пароля сотруднику'}</h3>
                
                {!isOwnProfile && userName && (
                    <div className={styles.userInfo}>
                        <p>Пользователь: <strong>{userName}</strong></p>
                        {userEmail && <p>Email: <strong>{userEmail}</strong></p>}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.passwordForm}>
                    {isOwnProfile && (
                        <div className={styles.formGroup}>
                            <label htmlFor="oldPassword">Текущий пароль *</label>
                            <PasswordInput
                                id="oldPassword"
                                name="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Введите текущий пароль"
                                required
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword">Новый пароль *</label>
                        <PasswordInputWithGeneration
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onGeneratePassword={handleGeneratePassword}
                            placeholder="Минимум 8 символов"
                            required
                            showGenerateButton={true}
                        />
                        <div className={styles.passwordHint}>
                            Пароль должен содержать минимум 8 символов
                        </div>
                    </div>

                    {(validationError || error) && (
                        <div className={styles.errorMessage}>
                            {validationError || error}
                        </div>
                    )}

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Сохранение...' : (isOwnProfile ? 'Изменить мой пароль' : 'Изменить пароль сотруднику')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
import { useState, type ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@store/store';
import { userThunks } from '@store/features/user-slice/user-thunks';
import Preloader from '@components/preloader/preloader';

import ava1 from "@assets/images/profile/ava-1.png"
import ava2 from "@assets/images/profile/ava-2.png"
import ava3 from "@assets/images/profile/ava-3.png"
import ava4 from "@assets/images/profile/ava-4.png"
import ava5 from "@assets/images/profile/ava-5.png"
import ava6 from "@assets/images/profile/ava-6.png"
import workImage from "@assets/images/profile/image.png"
import styles from './profile-page.module.scss';

const AVAILABLE_AVATARS = [ava1, ava2, ava3, ava4, ava5, ava6];

// Тип для локального состояния пользователя (совместимый с UI)
interface LocalUser {
    surname: string;
    name: string;
    patronymic: string;
    birthDate: string;
    email: string;
    phone: string;
    socialLink: string;
    department: string;
    position: string;
    grade: string;
    preferredShiftType: string;
    workDays: string;
    workHours: string;
    avatar: string;
}

// Преобразование данных из API в локальный формат
const mapProfileToLocalUser = (profile: any): LocalUser => {
    if (!profile) {
        return {
            surname: '',
            name: '',
            patronymic: '',
            birthDate: '',
            email: '',
            phone: '',
            socialLink: '',
            department: '',
            position: '',
            grade: '',
            preferredShiftType: '',
            workDays: '15',
            workHours: '120',
            avatar: ava1
        };
    }

    return {
        surname: profile.profile?.lastName || '',
        name: profile.profile?.firstName || '',
        patronymic: profile.profile?.middleName || '',
        birthDate: profile.profile?.birthDate
            ? new Date(profile.profile.birthDate).toLocaleDateString('ru-RU')
            : '',
        email: profile.email || '',
        phone: profile.profile?.phoneNumber || '',
        socialLink: profile.profile?.tgLink || '',
        department: profile.workInfo?.department || '',
        position: profile.workInfo?.position || '',
        grade: profile.workInfo?.grade || '',
        preferredShiftType: profile.workInfo?.preferredShiftType || '',
        workDays: '15', // Пока оставляем хардкод
        workHours: '120', // Пока оставляем хардкод
        avatar: ava1
    };
};

export const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUserProfile, loading, error } = useSelector((state: RootState) => state.user);

    const [user, setUser] = useState<LocalUser>(() => mapProfileToLocalUser(currentUserProfile));
    const [isEditing, setIsEditing] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [formData, setFormData] = useState<LocalUser>(() => ({ ...user }));

    // Загрузка профиля при монтировании
    useEffect(() => {
        dispatch(userThunks.fetchCurrentUserProfile());
    }, [dispatch]);

    // Синхронизация локального состояния с данными из store
    useEffect(() => {
        if (currentUserProfile) {
            const mappedUser = mapProfileToLocalUser(currentUserProfile);
            setUser(mappedUser);
            // Если не в режиме редактирования, обновляем formData
            if (!isEditing) {
                setFormData(mappedUser);
            }
        }
    }, [currentUserProfile, isEditing]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setUser(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ ...user });
        setIsEditing(false);
    };

    const handleAvatarClick = () => {
        setIsAvatarModalOpen(true);
    };

    const handleAvatarSelect = (avatar: string) => {
        if (isEditing) {
            setFormData(prev => ({ ...prev, avatar }));
        } else {
            setUser(prev => ({ ...prev, avatar }));
            setFormData(prev => ({ ...prev, avatar }));
        }
        setIsAvatarModalOpen(false);
    };

    // Отображение состояния загрузки
    if (loading && !currentUserProfile) {
        return (
            <div className={styles.container}>
                <h2>Профиль пользователя</h2>
                <Preloader variant="inline" size="large" text="Загрузка профиля..." />
            </div>
        );
    }

    // Отображение ошибки
    if (error && !currentUserProfile) {
        return (
            <div className={styles.container}>
                <h2>Профиль пользователя</h2>
                <div className={styles.error}>Ошибка загрузки профиля: {error}</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2>Профиль пользователя</h2>
            
            <div className={styles.profileContent}>
                <div className={styles.column}>
                    <div className={styles.avatarSection}>
                        <div 
                            className={styles.avatar}
                            onClick={handleAvatarClick}
                        >
                            <img 
                                src={isEditing ? formData.avatar : user.avatar} 
                                alt="Аватар" 
                                className={styles.avatarImage}
                            />
                            <div className={`${styles.avatarOverlay} ${isEditing ? styles.visible : ''}`}>
                                {isEditing ? 'Изменить' : ''}
                            </div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h3>General information</h3>
                        {isEditing ? (
                            <div className={styles.editForm}>
                                <div className={styles.formGroup}>
                                    <label>Фамилия</label>
                                    <input name="surname" value={formData.surname} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Имя</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Отчество</label>
                                    <input name="patronymic" value={formData.patronymic} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Дата рождения</label>
                                    <input name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input name="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Phone number</label>
                                    <input name="phone" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Social link</label>
                                    <input name="socialLink" value={formData.socialLink} onChange={handleInputChange} />
                                </div>
                            </div>
                        ) : (
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Фамилия</span>
                                    <span className={styles.value}>{user.surname}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Имя</span>
                                    <span className={styles.value}>{user.name}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Отчество</span>
                                    <span className={styles.value}>{user.patronymic}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Дата рождения</span>
                                    <span className={styles.value}>{user.birthDate}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Email</span>
                                    <span className={styles.value}>{user.email}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Phone number</span>
                                    <span className={styles.value}>{user.phone}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Social link</span>
                                    <span className={styles.value}>{user.socialLink}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.column}>
                    <div className={styles.card}>
                        <h3>Work information</h3>
                        {isEditing ? (
                            <div className={styles.editForm}>
                                <div className={styles.formGroup}>
                                    <label>Отдел</label>
                                    <input name="department" value={formData.department} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Позиция</label>
                                    <input name="position" value={formData.position} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Grade</label>
                                    <input name="grade" value={formData.grade} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Предпочтительный тип смены</label>
                                    <input name="preferredShiftType" value={formData.preferredShiftType} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Рабочих дней в месяце</label>
                                    <input name="workDays" value={formData.workDays} onChange={handleInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Рабочих часов в месяце</label>
                                    <input name="workHours" value={formData.workHours} onChange={handleInputChange} />
                                </div>
                            </div>
                        ) : (
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Отдел</span>
                                    <span className={styles.value}>{user.department}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Позиция</span>
                                    <span className={styles.value}>{user.position}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Grade</span>
                                    <span className={styles.value}>{user.grade}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Предпочтительный тип смены</span>
                                    <span className={styles.value}>{user.preferredShiftType}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Рабочих дней в месяце</span>
                                    <span className={styles.value}>{user.workDays}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>Рабочих часов в месяце</span>
                                    <span className={styles.value}>{user.workHours}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.workImageContainer}>
                        <img src={workImage} alt="Work" className={styles.workImage} />
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                {isEditing ? (
                    <>
                        <button className={styles.saveButton} onClick={handleSave}>Сохранить</button>
                        <button className={styles.cancelButton} onClick={handleCancel}>Отмена</button>
                    </>
                ) : (
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>Редактировать профиль</button>
                )}
            </div>

            {isAvatarModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAvatarModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>Выберите аватар</h3>
                        <div className={styles.avatarGrid}>
                            {AVAILABLE_AVATARS.map((avatar, index) => (
                                <div 
                                    key={index} 
                                    className={`${styles.avatarOption} ${formData.avatar === avatar ? styles.selected : ''}`}
                                    onClick={() => handleAvatarSelect(avatar)}
                                >
                                    <img src={avatar} alt={`Avatar ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button className={styles.closeButton} onClick={() => setIsAvatarModalOpen(false)}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};
import { type ChangeEvent } from 'react';
import styles from './profile-view.module.scss';

// Импортируем аватары из оригинального файла
import ava1 from "@assets/images/profile/ava-1.png"
import ava2 from "@assets/images/profile/ava-2.png"
import ava3 from "@assets/images/profile/ava-3.png"
import ava4 from "@assets/images/profile/ava-4.png"
import ava5 from "@assets/images/profile/ava-5.png"
import ava6 from "@assets/images/profile/ava-6.png"
import workImage from "@assets/images/profile/image.png"

const AVAILABLE_AVATARS = [ava1, ava2, ava3, ava4, ava5, ava6];

// Тип для данных пользователя (совместимый с оригинальным LocalUser)
export interface ProfileUser {
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

export interface ProfileViewProps {
    // Данные пользователя
    user: ProfileUser;
    // Режим редактирования
    isEditing: boolean;
    // Данные формы при редактировании
    formData: ProfileUser;
    // Колбэки
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    onEditToggle: () => void;
    onAvatarClick: () => void;
    onAvatarSelect: (avatar: string) => void;
    onBlockUser?: (newStatus: boolean) => void;
    // Состояние модального окна аватара
    isAvatarModalOpen: boolean;
    onAvatarModalClose: () => void;
}

export const ProfileView = ({
    user,
    isEditing,
    formData,
    onInputChange,
    onSave,
    onCancel,
    onEditToggle,
    onAvatarClick,
    onBlockUser,
    onAvatarSelect,
    isAvatarModalOpen,
    onAvatarModalClose
}: ProfileViewProps) => {
    const isBlocked = false;
    const blockedLable: string = !isBlocked ? 'Заблокировать профиль' : 'Разблокировать профиль';

    const handleBlockToggle = () => {
        if (onBlockUser) {
            onBlockUser(!isBlocked);
        }
    };

    console.log('onAvatarClick=', onAvatarClick);
    

    return (
        <div className={styles.container}>

            <div className={styles.profileContent}>
                <div className={styles.titleContent}>
                    <h2>Личная информация</h2>
                    <p>Персональные и рабочие данные сотрудника</p>
                </div>

                <div className={styles.actions}>
                    {isEditing ? (
                        <>
                            <button className={styles.saveButton} onClick={onSave}>Сохранить</button>
                            <button className={styles.cancelButton} onClick={onCancel}>Отмена</button>
                        </>
                    ) : (
                        <>
                            <button className={styles.editButton} onClick={onEditToggle}>Редактировать профиль</button>
                            <button className={styles.blockButton} onClick={handleBlockToggle}>{blockedLable}</button>
                        </>
                    )}
                </div>
            </div>
            
            <div className={styles.profileContent}>
                <div className={styles.column}>
                    {/* <div className={styles.avatarSection}>
                        <div 
                            className={styles.avatar}
                            onClick={onAvatarClick}
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
                    </div> */}

                    <div className={styles.card}>
                        <h3>General information</h3>
                        {isEditing ? (
                            <div className={styles.editForm}>
                                <div className={styles.formGroup}>
                                    <label>Фамилия</label>
                                    <input name="surname" value={formData.surname} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Имя</label>
                                    <input name="name" value={formData.name} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Отчество</label>
                                    <input name="patronymic" value={formData.patronymic} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Дата рождения</label>
                                    <input name="birthDate" value={formData.birthDate} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email</label>
                                    <input name="email" value={formData.email} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Phone number</label>
                                    <input name="phone" value={formData.phone} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Social link</label>
                                    <input name="socialLink" value={formData.socialLink} onChange={onInputChange} />
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
                                    <input name="department" value={formData.department} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Позиция</label>
                                    <input name="position" value={formData.position} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Grade</label>
                                    <input name="grade" value={formData.grade} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Предпочтительный тип смены</label>
                                    <input name="preferredShiftType" value={formData.preferredShiftType} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Рабочих дней в месяце</label>
                                    <input name="workDays" value={formData.workDays} onChange={onInputChange} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Рабочих часов в месяце</label>
                                    <input name="workHours" value={formData.workHours} onChange={onInputChange} />
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

            {isAvatarModalOpen && (
                <div className={styles.modalOverlay} onClick={onAvatarModalClose}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>Выберите аватар</h3>
                        <div className={styles.avatarGrid}>
                            {AVAILABLE_AVATARS.map((avatar, index) => (
                                <div 
                                    key={index} 
                                    className={`${styles.avatarOption} ${formData.avatar === avatar ? styles.selected : ''}`}
                                    onClick={() => onAvatarSelect(avatar)}
                                >
                                    <img src={avatar} alt={`Avatar ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button className={styles.closeButton} onClick={onAvatarModalClose}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};
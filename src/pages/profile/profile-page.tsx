import { useState } from 'react';

import ava from "@assets/images/ava/1.png"
import styles from './profile-page.module.scss';

export const ProfilePage = () => {
    const [user, setUser] = useState({
        fullName: 'Алексей Иванов',
        email: 'alexey.ivanov@example.com',
        department: 'Support',
        position: 'Менеджер',
        grade: 'Junior',
        scheduleType: 'Стандартный',
        shiftType: 'Дневная',
        phone: '+7 (999) 123-45-67',
        joinDate: '15.03.2023',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    return (
        <div className={styles.container}>
            <h2>Профиль пользователя</h2>
            
            <div className={styles.profileCard}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatar}>
                        <img 
                            src={ava} 
                            alt="Аватар" 
                            className={styles.avatarImage}
                        />
                    </div>
                    <div className={styles.avatarInfo}>
                        <h3>{user.fullName}</h3>
                        <p className={styles.email}>{user.email}</p>
                        <p className={styles.department}>{user.department} • {user.position}</p>
                        <button 
                            className={styles.editButton}
                            onClick={() => setIsEditing(true)}
                        >
                            Редактировать профиль
                        </button>
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <h4>Основная информация</h4>
                    
                    {isEditing ? (
                        <div className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label>ФИО</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Отдел</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                >
                                    <option value="Support">Support</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Development">Development</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Позиция</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Грейд</label>
                                <select
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                >
                                    <option value="Junior">Junior</option>
                                    <option value="Middle">Middle</option>
                                    <option value="Senior">Senior</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Тип графика</label>
                                <select
                                    name="scheduleType"
                                    value={formData.scheduleType}
                                    onChange={handleInputChange}
                                >
                                    <option value="Стандартный">Стандартный</option>
                                    <option value="Сменный">Сменный</option>
                                    <option value="Гибкий">Гибкий</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Тип смены</label>
                                <select
                                    name="shiftType"
                                    value={formData.shiftType}
                                    onChange={handleInputChange}
                                >
                                    <option value="Дневная">Дневная</option>
                                    <option value="Ночная">Ночная</option>
                                    <option value="Любая">Любая</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Телефон</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className={styles.saveButton} onClick={handleSave}>
                                    Сохранить
                                </button>
                                <button className={styles.cancelButton} onClick={handleCancel}>
                                    Отмена
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>ФИО:</span>
                                <span className={styles.value}>{user.fullName}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>{user.email}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Отдел:</span>
                                <span className={styles.value}>{user.department}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Позиция:</span>
                                <span className={styles.value}>{user.position}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Грейд:</span>
                                <span className={styles.value}>{user.grade}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Тип графика:</span>
                                <span className={styles.value}>{user.scheduleType}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Тип смены:</span>
                                <span className={styles.value}>{user.shiftType}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Телефон:</span>
                                <span className={styles.value}>{user.phone}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Дата приема:</span>
                                <span className={styles.value}>{user.joinDate}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
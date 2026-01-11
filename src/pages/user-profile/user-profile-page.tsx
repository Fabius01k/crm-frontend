import { useState, type ChangeEvent, useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@store/store';
import { userThunks } from '@store/features/user-slice/user-thunks';
import Preloader from '@components/preloader/preloader';
import { ProfileView, type ProfileUser } from '@components/profile-view/profile-view';

import ava1 from "@assets/images/profile/ava-1.png"
import styles from './user-profile-page.module.scss';

// Преобразование данных из API в локальный формат
const mapProfileToLocalUser = (profile: any): ProfileUser => {
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
            workSchedule: '',
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
        workSchedule: profile.workInfo?.workSchedule || '',
        preferredShiftType: profile.workInfo?.shiftPreference || '',
        workDays: '15', // Пока оставляем хардкод
        workHours: '120', // Пока оставляем хардкод
        avatar: ava1
    };
};

export const UserProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { users, currentUser, loading, error, companyStructure } = useSelector((state: RootState) => state.user);
    const { user: authUser } = useSelector((state: RootState) => state.auth);

    console.log('store users:', users);
    console.log('store currentUser:', currentUser);
    console.log('id:', id);

    // Используем currentUser (загруженный через fetchUserPage) или ищем в users
    const userFromStore = currentUser && currentUser.id === id ? currentUser : users.find(u => u.id === id);
    console.log('userFromStore:', userFromStore);
    
    const [user, setUser] = useState<ProfileUser>(() => mapProfileToLocalUser(userFromStore));
    const [isEditing, setIsEditing] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [formData, setFormData] = useState<ProfileUser>(() => ({ ...user }));

    // Загрузка структуры компании, если её нет
    useEffect(() => {
        if (!companyStructure) {
            dispatch(userThunks.fetchCompanyStructure());
        }
    }, [dispatch, companyStructure]);

    // Загрузка профиля пользователя по ID
    useEffect(() => {
        if (id) {
            dispatch(userThunks.fetchUserPage(id));
        }
    }, [dispatch, id]);

    // Синхронизация локального состояния с данными из store
    useEffect(() => {
        if (userFromStore) {
            console.log('userFromStore:', userFromStore);
            const mappedUser = mapProfileToLocalUser(userFromStore);
            console.log('mappedUser:', mappedUser);
            setUser(mappedUser);
            // Если не в режиме редактирования, обновляем formData
            if (!isEditing) {
                setFormData(mappedUser);
            }
        }
    }, [userFromStore, isEditing]);

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

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleAvatarModalClose = () => {
        setIsAvatarModalOpen(false);
    };

    // Отображение состояния загрузки
    if (loading) {
        return (
            <div className={styles.container}>
                <Preloader variant="fullscreen" text="Загрузка профиля..." />
            </div>
        );
    }

    // Отображение ошибки
    if (error && !userFromStore) {
        return (
            <div className={styles.container}>
                <h2>Профиль пользователя</h2>
                <div className={styles.error}>Ошибка загрузки профиля: {error}</div>
            </div>
        );
    }

    return (
        <ProfileView
            user={user}
            isEditing={isEditing}
            formData={formData}
            companyStructure={companyStructure}
            isOwnProfile={false}
            currentUserRole={authUser.role}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onCancel={handleCancel}
            onEditToggle={handleEditToggle}
            onAvatarClick={handleAvatarClick}
            onAvatarSelect={handleAvatarSelect}
            isAvatarModalOpen={isAvatarModalOpen}
            onAvatarModalClose={handleAvatarModalClose}
        />
    );
};
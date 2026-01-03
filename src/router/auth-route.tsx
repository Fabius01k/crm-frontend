import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '@constants/constants';
import { instance } from '@api/instance';
import Preloader from '@/components/preloader/preloader';
import { useAppDispatch } from '@/store/store';

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    
    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsChecking(false);
                return;
            }
            
            try {
                // Делаем любой запрос к защищенному эндпоинту
                // Например, получение профиля пользователя
                await instance.get('/users/me/page');
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };
        
        checkAuth();
    }, [token]);
    
    if (isChecking) {
        return <Preloader variant='fullscreen'/>; // или компонент лоадера
    }
    
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
};
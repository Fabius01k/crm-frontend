import { Navigate } from 'react-router';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '@constants/constants';

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    
    if (token) {
        return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
};
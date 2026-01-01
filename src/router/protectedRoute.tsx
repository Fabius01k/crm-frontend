import { Navigate } from 'react-router';
import { LOCAL_STORAGE_ACCESS_TOKEN } from '@constants/constants';
import { PATHS } from '@router/paths';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    
    if (!token) {
        return <Navigate to={PATHS.auth} replace />;
    }
    
    return <>{children}</>;
};
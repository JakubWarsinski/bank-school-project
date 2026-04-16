import { isAuthenticated } from '@/common/utils/auth';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
	if (!isAuthenticated()) {
		return <Navigate to='/login' replace />;
	}

	return <Outlet />;
};

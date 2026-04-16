import { isAuthenticated } from '@/common/utils/auth';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicRoute = () => {
	if (isAuthenticated()) {
		return <Navigate to='/' replace />;
	}

	return <Outlet />;
};

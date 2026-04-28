import './index.css';

import { createRoot } from 'react-dom/client';
import { LoginPage } from './pages/auth/Login';
import Dashboard from './pages/main/Dashboard';
import { ProfilePage } from './pages/profile/Profile';
import { PublicRoute } from './components/routes/PublicRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import History from './pages/history/History';
import Finances from './pages/finances/Finances';
import Transaction from './pages/transaction/Transaction';

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Routes>
			<Route element={<PublicRoute />}>
				<Route path='/login' element={<LoginPage />} />
			</Route>

			<Route element={<ProtectedRoute />}>
				<Route path='/' element={<Dashboard />} />
				<Route path='/profile' element={<ProfilePage />} />
				<Route path='/history' element={<History />} />
				<Route path='/finances' element={<Finances />} />
				<Route path='/transfers' element={<Transaction />} />
			</Route>
		</Routes>
	</BrowserRouter>,
);

import { AuthUser } from '@/types/auth';
import { useEffect, useState } from 'react';
import { getUser } from '@/common/utils/auth';
import { LogoIcon } from '../icons/Logo';
import { BellEmptyIcon } from '../icons/BellEmpty';
import { GearEmptyIcon } from '../icons/GearEmpty';
import { LogoutEmptyIcon } from '../icons/LogoutEmpty';
import { BarsIcon } from '../icons/Bars';
import { useDarkMode } from '@/useDarkMode';
import { useNavigate } from 'react-router-dom';
import { SunIcon } from '../icons/SunEmpty';
import { MoonIcon } from '../icons/MoonEmpty';

export const Header = () => {
	const [user, setUser] = useState<AuthUser>();
	const [open, setOpen] = useState(false);
	const { dark, setDark } = useDarkMode();

	const navigate = useNavigate();

	useEffect(() => {
		setUser(getUser());
	}, []);

	const getInitials = () => {
		return `${user?.first_name.charAt(0)}${user?.last_name.charAt(0)}`.toUpperCase();
	};

	const handleLogout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');

		window.location.reload();
	};

	const changePage = (name: string) => {
		navigate(`/${name}`);
	};

	const navLinks = {
		Start: './',
		Przelewy: 'transfers',
		'Moje finanse': 'finances',
		Historia: 'history',
		Usługi: 'services',
		'Dla ciebie': 'for_me',
		Kontakt: 'contact',
	};

	return (
		<header className='relative w-full flex items-center justify-between px-4 md:px-8 py-3 shadow-md bg-white text-black dark:bg-gray-900 dark:text-white'>
			<LogoIcon size={45} />

			<nav className='hidden md:flex gap-6 text-sm font-medium '>
				{Object.entries(navLinks).map(([label, path]) => (
					<a key={label} href={path} className='hover:text-blue-500 transition'>
						{label}
					</a>
				))}
			</nav>

			<div className='flex items-center gap-3'>
				<button className='md:hidden p-2 rounded-lg hover:bg-gray-100' onClick={() => setOpen(!open)}>
					<BarsIcon size={20} />
				</button>

				<button
					onClick={() => setDark(!dark)}
					className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
				>
					{dark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
				</button>

				<div className='relative'>
					<button className='p-2 rounded-lg hover:bg-gray-100'>
						<BellEmptyIcon size={20} className='dark:text-white' />
					</button>

					<span className='absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 rounded-full'>
						0
					</span>
				</div>

				{/* SETTINGS */}
				<button onClick={() => changePage('profile')} className='p-2 rounded-lg hover:bg-gray-100'>
					<GearEmptyIcon size={20} />
				</button>

				{/* LOGOUT */}
				<button onClick={handleLogout} className='p-2 rounded-lg hover:bg-gray-100'>
					<LogoutEmptyIcon size={20} />
				</button>

				{/* PROFILE */}
				{user && (
					<div className='hidden md:flex items-center gap-3 ml-3'>
						<div className='w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold'>
							{getInitials()}
						</div>

						<div className='flex flex-col text-xs'>
							<span className='text-gray-400'>Profil osobisty</span>
							<span className='font-semibold'>
								{user.first_name} {user.last_name}
							</span>
						</div>
					</div>
				)}
			</div>

			{/* MOBILE MENU */}
			{open && (
				<div className='absolute top-full left-0 w-full bg-white shadow-md flex flex-col md:hidden z-50'>
					{['Start', 'Przelewy', 'Moje finanse', 'Historia', 'Usługi', 'Dla ciebie', 'Kontakt'].map(
						(item) => (
							<a
								key={item}
								href='#'
								onClick={() => setOpen(false)}
								className='px-4 py-3 border-b hover:bg-gray-100'
							>
								{item}
							</a>
						),
					)}

					{user && (
						<div className='p-4 flex items-center gap-3'>
							<div className='w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold'>
								{getInitials()}
							</div>
							<div>
								<div className='text-sm font-semibold'>
									{user.first_name} {user.last_name}
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</header>
	);
};

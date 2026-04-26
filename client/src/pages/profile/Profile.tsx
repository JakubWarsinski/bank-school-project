import { userApi } from '@/api/user';
import { getUser } from '@/common/utils/auth';
import { Header } from '@/components/header/Header';
import { ProfileAgreements } from '@/components/profile/profile_info/ProfileAgreements';
import { ProfileInfo } from '@/components/profile/profile_info/ProfileInfo';
import { ProfileNotifications } from '@/components/profile/profile_info/ProfileNotifications';
import { ProfileSecurity } from '@/components/profile/profile_info/ProfileSecurity';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import '@/assets/css/profile.css';
import { BellIcon } from '@/components/icons/Bell';
import { ProfileIcon } from '@/components/icons/Profile';
import { ListIcon } from '@/components/icons/List';
import { HandShakeIcon } from '@/components/icons/HandShake';
import { ShieldIcon } from '@/components/icons/Shield';

export const ProfilePage = () => {
	const [user, setUser] = useState<User | null>(null);
	const [openSection, setOpenSection] = useState<string | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const userInfo = getUser();
				if (!userInfo) return;

				const data = await userApi.getUnique(userInfo.id);
				if (!data) return;

				setUser(data);
			} catch (error) {
				console.error('Błąd pobierania użytkownika:', error);
			}
		};

		loadUser();
	}, []);

	const handleToggle = (id: string) => {
		if (openSection != id) {
			setOpenSection(id);
		} else {
			setOpenSection(null);
		}
	};

	const sections = [
		{
			id: 'profile_info',
			title: 'Mój profil',
			description: 'Edytuj dane powiązane z Twoimi produktami i usługami',
			icon: ProfileIcon,
			component: ProfileInfo,
		},
		{
			id: 'profile_security',
			title: 'Bezpieczeństwo i hasło',
			description: 'Edytuj swój login i hasło oraz sposoby logowania',
			icon: ShieldIcon,
			component: ProfileSecurity,
		},
		{
			id: 'profile_notification',
			title: 'Powiadomienia',
			description: 'Zarządzaj powiadomieniami',
			icon: BellIcon,
			component: ProfileNotifications,
		},
		{
			id: 'profile_agreements',
			title: 'Zgody marketingowe i transakcyjne',
			description: 'Edytuj zgody marketingowe',
			icon: HandShakeIcon,
			component: ProfileAgreements,
		},
	];

	const getInitials = () => {
		return `${user?.first_name.charAt(0)}${user?.last_name.charAt(0)}`.toUpperCase();
	};

	return (
		<>
			<Header />

			<div className='max-w-6xl mx-auto px-4 py-6 space-y-6'>
				{/* TOP PROFILE BANNER */}
				{user && (
					<div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 shadow-lg'>
						{/* dekoracyjne blur */}
						<div className='absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl' />
						<div className='absolute -bottom-12 left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl' />

						<div className='relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
							<div className='flex items-center gap-4'>
								{/* avatar */}
								<div className='w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl font-bold shadow'>
									{getInitials()}
								</div>

								<div className='text-white'>
									<div className='text-sm text-white/70 mb-1'>Profil osobisty</div>

									<h1 className='text-2xl font-semibold leading-tight'>
										{user.first_name} {user.last_name}
									</h1>

									<p className='text-sm text-white/80 mt-1 break-all'>{user.email}</p>
								</div>
							</div>

							{/* prawa strona */}
							<div className='grid grid-cols-2 gap-3 sm:w-auto'>
								<div className='rounded-2xl bg-white/10 px-4 py-3 backdrop-blur'>
									<div className='text-xs text-white/70'>Status konta</div>
									<div className='text-sm font-medium text-white'>Aktywne</div>
								</div>

								<div className='rounded-2xl bg-white/10 px-4 py-3 backdrop-blur'>
									<div className='text-xs text-white/70'>Typ profilu</div>
									<div className='text-sm font-medium text-white'>Osobisty</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* LISTA BLOKÓW */}
				<div className='profile-list space-y-4'>
					{sections.map((section) => {
						const Component = section.component;

						return (
							<ProfileSection
								key={section.id}
								id={section.id}
								title={section.title}
								description={section.description}
								icon={section.icon}
								isOpen={openSection === section.id}
								onToggle={handleToggle}
							>
								<Component user={user} />
							</ProfileSection>
						);
					})}
				</div>
			</div>
		</>
	);
};

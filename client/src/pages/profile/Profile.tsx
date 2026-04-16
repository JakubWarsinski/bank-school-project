import { userApi } from '@/api/user';
import { getUser } from '@/common/utils/auth';
import { Header } from '@/components/header/Header';
import { ProfileAgreements } from '@/components/profile/profile_info/ProfileAgreements';
import { ProfileInfo } from '@/components/profile/profile_info/ProfileInfo';
import { ProfileLimits } from '@/components/profile/profile_info/ProfileLimits';
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
			id: 'profile_transaction',
			title: 'Limity transakcyjne',
			description: 'Ustaw swoje dzienne i miesięczne limity',
			icon: ListIcon,
			component: ProfileLimits,
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

	return (
		<>
			<Header />

			<div className='profile-list'>
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
		</>
	);
};

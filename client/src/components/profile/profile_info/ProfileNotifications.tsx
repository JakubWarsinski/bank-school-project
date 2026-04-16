import { User } from '@/types/user';
import { useState } from 'react';
import { Loading } from '@/components/loading/Loading';
import { maskText } from '@/common/utils/mask';

export const ProfileNotifications = ({ user }: { user: User | null }) => {
	const [revealed, setRevealed] = useState(false);

	return (
		<div>
			<button onClick={() => setRevealed(true)}>{revealed ? 'Odkryto dane' : 'Odkryj dane'}</button>

			<div className='profile'>
				<span className='profile-title'>Otrzymywanie powiadomień</span>

				<div className='profile-card'>
					<div className='profile-card-header'>
						<span className='profile-card-title'>Numer telefonu</span>
						<div className='profile-divider'></div>
						<button className='profile-edit'>Edytuj</button>
					</div>

					<span className='profile-label'>{!user ? <Loading /> : maskText(user.phone_number, revealed)}</span>
				</div>

				<div className='profile-card'>
					<div className='profile-card-header'>
						<span className='profile-card-title'>Adres e-mail</span>
						<div className='profile-divider'></div>
						<button className='profile-edit'>Edytuj</button>
					</div>

					<span className='profile-label'>{!user ? <Loading /> : maskText(user.email, revealed)}</span>
				</div>
			</div>
		</div>
	);
};

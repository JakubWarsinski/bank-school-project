import { User } from '@/types/user';
import { useState } from 'react';
import { Loading } from '@/components/loading/Loading';
import { maskText } from '@/common/utils/mask';
import { formatDate } from '@/common/utils/formatDate';

export const ProfileInfo = ({ user }: { user: User | null }) => {
	const [revealed, setRevealed] = useState(false);

	return (
		<div>
			<button onClick={() => setRevealed(true)}>{revealed ? 'Odkryto dane' : 'Odkryj dane'}</button>

			<div className='profile'>
				<span className='profile-title'>Moje dane teleadresowe</span>

				<div className='profile-card'>
					<div className='profile-card-header'>
						<span className='profile-card-title'>Adres zamieszkania</span>
						<div className='profile-divider'></div>
						<button className='profile-edit'>Edytuj</button>
					</div>

					<span className='profile-label'>
						{!user ? (
							<Loading />
						) : (
							maskText(`${user.street} ${user.postal_code} ${user.city}, Polska`, revealed)
						)}
					</span>
				</div>

				<div className='profile-card'>
					<div className='profile-card-header'>
						<span className='profile-card-title'>Numer telefonu do kontaktu</span>
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

			<div className='profile'>
				<span className='profile-title'>Moje pozostałe dane</span>

				<div className='profile-card'>
					<div className='profile-card-header'>
						<span className='profile-card-title'>Dowód osobisty</span>
						<div className='profile-divider'></div>
						<button className='profile-edit'>Edytuj</button>
					</div>

					<div className='profile-row'>
						<span className='profile-label'>Numer i seria:</span>
						<span>{!user ? <Loading /> : maskText(user.id_card_number, revealed)}</span>
					</div>

					<div className='profile-row'>
						<span className='profile-label'>Data wydania:</span>
						<span>{!user ? <Loading /> : maskText(formatDate(user.id_card_issue), revealed)}</span>
					</div>

					<div className='profile-row'>
						<span className='profile-label'>Data ważności:</span>
						<span>{!user ? <Loading /> : maskText(formatDate(user.id_card_expiry), revealed)}</span>
					</div>
				</div>

				<div className='profile-card'>
					<div className='profile-card-header'>
						<span className='profile-card-title'>Informacje o dochodach</span>
						<div className='profile-divider'></div>
						<button className='profile-edit'>Edytuj</button>
					</div>

					<div className='profile-row'>
						<span className='profile-label'>Sytuacja zawodowa:</span>
						<span>{!user ? <Loading /> : maskText(user.profession, revealed)}</span>
					</div>

					<div className='profile-row'>
						<span className='profile-label'>Średni miesięczny dochód netto:</span>
						<span>{!user ? <Loading /> : maskText(user.monthly_net_income, revealed)}</span>
					</div>

					<div className='profile-row'>
						<span className='profile-label'>Główne źródło dochodu:</span>
						<span>{!user ? <Loading /> : maskText(user.main_income_sources, revealed)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

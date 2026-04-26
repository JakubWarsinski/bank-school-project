import { User } from '@/types/user';
import { useState } from 'react';
import { Loading } from '@/components/loading/Loading';
import { maskText } from '@/common/utils/mask';
import { formatDate } from '@/common/utils/formatDate';
import { EditAddressPopup } from '../profile_popup/EditAddressPopup';
import { EditContactPopup } from '../profile_popup/EditContactPopup';
import { EditIdCardPopup } from '../profile_popup/EditIdCardPopup';
import { EditIncomePopup } from '../profile_popup/EditIncomePopup';

export const ProfileInfo = ({ user }: { user: User | null }) => {
	const [revealed, setRevealed] = useState(false);

	const [activePopup, setActivePopup] = useState<'address' | 'contact' | 'id' | 'income' | null>(null);

	const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
		<div className='grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-4 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0'>
			<span className='text-zinc-500 dark:text-zinc-400'>{label}</span>

			<span className='font-medium text-zinc-900 dark:text-zinc-100 break-all'>{value}</span>
		</div>
	);

	return (
		<div className='max-w-5xl mx-auto p-6 space-y-8'>
			<div className='flex justify-end'>
				<button
					onClick={() => setRevealed(true)}
					className='px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 transition dark:bg-white dark:text-black'
				>
					{revealed ? 'Odkryto dane' : 'Odkryj dane'}
				</button>
			</div>

			{/* TELEADRESOWE */}
			<section className='space-y-4'>
				<h2 className='text-xl font-semibold text-zinc-900 dark:text-white'>Moje dane teleadresowe</h2>

				<div className='grid gap-4'>
					{[
						{
							title: 'Adres zamieszkania',
							type: 'address',
							value: !user ? (
								<Loading />
							) : (
								maskText(`${user.street} ${user.postal_code} ${user.city}, Polska`, revealed)
							),
						},
						{
							title: 'Numer telefonu do kontaktu',
							type: 'contact',
							value: !user ? <Loading /> : maskText(user.phone_number, revealed),
						},
						{
							title: 'Adres e-mail',
							type: 'contact',
							value: !user ? <Loading /> : maskText(user.email, revealed),
						},
					].map((item, index) => (
						<div
							key={index}
							className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
						>
							<div className='flex items-center gap-4 mb-3'>
								<span className='font-medium text-zinc-900 dark:text-white'>{item.title}</span>

								<div className='flex-1 h-px bg-zinc-200 dark:bg-zinc-700' />

								<button
									onClick={() => setActivePopup(item.type)}
									className='text-sm font-medium text-blue-600 hover:underline'
								>
									Edytuj
								</button>
							</div>

							<div className='text-zinc-600 dark:text-zinc-300 break-all'>{item.value}</div>
						</div>
					))}
				</div>
			</section>

			{/* POZOSTAŁE */}
			<section className='space-y-4'>
				<h2 className='text-xl font-semibold text-zinc-900 dark:text-white'>Moje pozostałe dane</h2>

				{/* Dowód */}
				<div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
					<div className='flex items-center gap-4 mb-4'>
						<span className='font-medium text-zinc-900 dark:text-white'>Dowód osobisty</span>

						<div className='flex-1 h-px bg-zinc-200 dark:bg-zinc-700' />

						<button
							onClick={() => setActivePopup('id')}
							className='text-sm font-medium text-blue-600 hover:underline'
						>
							Edytuj
						</button>
					</div>

					<div className='space-y-3 text-sm'>
						<Row
							label='Numer i seria'
							value={!user ? <Loading /> : maskText(user.id_card_number, revealed)}
						/>
						<Row
							label='Data wydania'
							value={!user ? <Loading /> : maskText(formatDate(user.id_card_issue), revealed)}
						/>
						<Row
							label='Data ważności'
							value={!user ? <Loading /> : maskText(formatDate(user.id_card_expiry), revealed)}
						/>
					</div>
				</div>

				{/* Dochody */}
				<div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
					<div className='flex items-center gap-4 mb-4'>
						<span className='font-medium text-zinc-900 dark:text-white'>Informacje o dochodach</span>

						<div className='flex-1 h-px bg-zinc-200 dark:bg-zinc-700' />

						<button
							onClick={() => setActivePopup('income')}
							className='text-sm font-medium text-blue-600 hover:underline'
						>
							Edytuj
						</button>
					</div>

					<div className='space-y-3 text-sm'>
						<Row
							label='Sytuacja zawodowa'
							value={!user ? <Loading /> : maskText(user.profession, revealed)}
						/>
						<Row
							label='Średni miesięczny dochód netto'
							value={!user ? <Loading /> : maskText(user.monthly_net_income, revealed)}
						/>
						<Row
							label='Główne źródło dochodu'
							value={!user ? <Loading /> : maskText(user.main_income_sources, revealed)}
						/>
					</div>
				</div>
			</section>

			<EditAddressPopup open={activePopup === 'address'} onClose={() => setActivePopup(null)} user={user} />

			<EditContactPopup open={activePopup === 'contact'} onClose={() => setActivePopup(null)} user={user} />

			<EditIdCardPopup open={activePopup === 'id'} onClose={() => setActivePopup(null)} user={user} />

			<EditIncomePopup open={activePopup === 'income'} onClose={() => setActivePopup(null)} user={user} />
		</div>
	);
};

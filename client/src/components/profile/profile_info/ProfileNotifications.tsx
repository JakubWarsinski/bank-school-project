import { User } from '@/types/user';
import { useState } from 'react';
import { Loading } from '@/components/loading/Loading';
import { maskText } from '@/common/utils/mask';

export const ProfileNotifications = ({ user }: { user: User | null }) => {
	const [revealed, setRevealed] = useState(false);

	return (
		<div className='max-w-5xl mx-auto p-6 space-y-6'>
			<div className='flex justify-end'>
				<button
					onClick={() => setRevealed(true)}
					className='px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90 transition dark:bg-white dark:text-black'
				>
					{revealed ? 'Odkryto dane' : 'Odkryj dane'}
				</button>
			</div>

			<section className='space-y-4'>
				<h2 className='text-xl font-semibold text-zinc-900 dark:text-white'>Otrzymywanie powiadomień</h2>

				<div className='grid gap-4'>
					{/* TELEFON */}
					<div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900'>
						<div className='flex items-center gap-4 mb-3'>
							<span className='font-medium text-zinc-900 dark:text-white'>Numer telefonu</span>

							<div className='flex-1 h-px bg-zinc-200 dark:bg-zinc-700' />

							<button className='text-sm font-medium text-blue-600 hover:underline'>Edytuj</button>
						</div>

						<div className='text-sm text-zinc-500 mb-2 dark:text-zinc-400'>
							Numer używany do SMS-ów i alertów bezpieczeństwa.
						</div>

						<div className='font-medium text-zinc-900 dark:text-zinc-100'>
							{!user ? <Loading /> : maskText(user.phone_number, revealed)}
						</div>
					</div>

					{/* EMAIL */}
					<div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900'>
						<div className='flex items-center gap-4 mb-3'>
							<span className='font-medium text-zinc-900 dark:text-white'>Adres e-mail</span>

							<div className='flex-1 h-px bg-zinc-200 dark:bg-zinc-700' />

							<button className='text-sm font-medium text-blue-600 hover:underline'>Edytuj</button>
						</div>

						<div className='text-sm text-zinc-500 mb-2 dark:text-zinc-400'>
							Adres do powiadomień, wiadomości i potwierdzeń.
						</div>

						<div className='font-medium text-zinc-900 dark:text-zinc-100 break-all'>
							{!user ? <Loading /> : maskText(user.email, revealed)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

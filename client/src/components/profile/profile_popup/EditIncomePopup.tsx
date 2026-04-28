import { userApi } from '@/api/user';
import Popup from '@/components/popup/Popup';
import { useState } from 'react';

export function EditIncomePopup({ open, onClose, user }) {
	const [profession, setProfession] = useState(user?.profession || '');
	const [income, setIncome] = useState(user?.monthly_net_income || '');
	const [source, setSource] = useState(user?.main_income_sources || '');
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		if (!user?.user_id) return;

		try {
			setLoading(true);

			await userApi.patch(user.user_id, {
				profession,
				monthly_net_income: income,
				main_income_sources: source,
			});

			onClose();
		} finally {
			setLoading(false);
		}
	};

	return (
		<Popup isOpen={open} onClose={onClose} title='Dochody' description='Informacje finansowe'>
			<div className='space-y-3'>
				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					onChange={(e) => setProfession(e.target.value)}
					placeholder='Sytuacja zawodowa'
				/>

				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					onChange={(e) => setIncome(e.target.value)}
					placeholder='Dochód'
				/>

				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					onChange={(e) => setSource(e.target.value)}
					placeholder='Źródło dochodu'
				/>

				<div className='flex justify-end gap-2'>
					<button onClick={onClose} className='px-4 py-2 rounded-xl border'>
						Anuluj
					</button>

					<button
						onClick={handleSave}
						disabled={loading}
						className='px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50'
					>
						{loading ? 'Zapisywanie...' : 'Zapisz'}
					</button>
				</div>
			</div>
		</Popup>
	);
}

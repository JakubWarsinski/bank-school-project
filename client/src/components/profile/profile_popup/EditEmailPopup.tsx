import { userApi } from '@/api/user';
import Popup from '@/components/popup/Popup';
import { useState } from 'react';

export function EditEmailPopup({ open, onClose, user }) {
	const [email, setEmail] = useState(user?.email_number || '');
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		if (!user?.user_id) return;

		try {
			setLoading(true);

			await userApi.patch(user.user_id, {
				email,
			});

			onClose();
		} finally {
			setLoading(false);
		}
	};

	return (
		<Popup isOpen={open} onClose={onClose} title='Edytuj dane kontaktowe' description='Adres e-mail'>
			<div className='space-y-3'>
				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					onChange={(e) => setEmail(e.target.value)}
					placeholder='E-mail'
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

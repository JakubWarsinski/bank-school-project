import Popup from '@/components/popup/Popup';
import { useState } from 'react';

export function EditContactPopup({ open, onClose, user }) {
	const [phone, setPhone] = useState(user?.phone_number || '');
	const [email, setEmail] = useState(user?.email || '');

	const handleSave = () => {
		console.log('CONTACT UPDATE:', { phone, email });
		onClose();
	};

	return (
		<Popup isOpen={open} onClose={onClose} title='Edytuj dane kontaktowe' description='Telefon i adres e-mail'>
			<div className='space-y-3'>
				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder='Telefon'
				/>

				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Email'
				/>

				<div className='flex justify-end gap-2'>
					<button onClick={onClose} className='px-4 py-2 rounded-xl border'>
						Anuluj
					</button>

					<button onClick={handleSave} className='px-4 py-2 rounded-xl bg-blue-600 text-white'>
						Zapisz
					</button>
				</div>
			</div>
		</Popup>
	);
}

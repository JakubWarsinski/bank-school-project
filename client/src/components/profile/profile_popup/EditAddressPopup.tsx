import Popup from '@/components/popup/Popup';
import { useState } from 'react';

export function EditAddressPopup({ open, onClose, user }) {
	const [street, setStreet] = useState(user?.street || '');
	const [city, setCity] = useState(user?.city || '');
	const [postal, setPostal] = useState(user?.postal_code || '');

	const handleSave = () => {
		console.log('ADDRESS UPDATE:', {
			street,
			city,
			postal,
		});
		onClose();
	};

	return (
		<Popup isOpen={open} onClose={onClose} title='Edytuj adres' description='Zaktualizuj swoje dane adresowe'>
			<div className='space-y-3'>
				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={street}
					onChange={(e) => setStreet(e.target.value)}
					placeholder='Ulica'
				/>

				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={city}
					onChange={(e) => setCity(e.target.value)}
					placeholder='Miasto'
				/>

				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={postal}
					onChange={(e) => setPostal(e.target.value)}
					placeholder='Kod pocztowy'
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

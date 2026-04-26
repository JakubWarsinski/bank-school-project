import Popup from '@/components/popup/Popup';
import { useState } from 'react';

export function EditIdCardPopup({ open, onClose, user }) {
	const [number, setNumber] = useState(user?.id_card_number || '');
	const [issue, setIssue] = useState(user?.id_card_issue || '');
	const [expiry, setExpiry] = useState(user?.id_card_expiry || '');

	const handleSave = () => {
		console.log('ID CARD UPDATE:', {
			number,
			issue,
			expiry,
		});
		onClose();
	};

	return (
		<Popup isOpen={open} onClose={onClose} title='Dowód osobisty' description='Dane dokumentu'>
			<div className='space-y-3'>
				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={number}
					onChange={(e) => setNumber(e.target.value)}
					placeholder='Numer i seria'
				/>

				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={issue}
					onChange={(e) => setIssue(e.target.value)}
					placeholder='Data wydania'
				/>

				<input
					className='w-full p-3 border rounded-xl dark:bg-zinc-800'
					value={expiry}
					onChange={(e) => setExpiry(e.target.value)}
					placeholder='Data ważności'
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

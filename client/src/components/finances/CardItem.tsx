import { Card } from '@/types/card';
import { useState } from 'react';

type Props = {
	card: Card;
};

export function CardItem({ card }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<div className='rounded-2xl border bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800'>
			<div className='flex justify-between'>
				<div>
					<div className='font-semibold'>{card.name}</div>

					<div className='text-sm text-zinc-500'>**** {card.last_digits}</div>
				</div>

				<div>{card.status}</div>
			</div>

			<button onClick={() => setOpen(!open)} className='mt-3 text-sm border px-3 py-1 rounded-xl'>
				{open ? 'Ukryj' : 'Szczegóły'}
			</button>

			{open && (
				<div className='mt-3 text-sm text-zinc-500'>
					<div>Limit: {card.daily_payment_limit}</div>
					<div>
						Exp: {card.expiry_month}/{card.expiry_year}
					</div>
				</div>
			)}
		</div>
	);
}

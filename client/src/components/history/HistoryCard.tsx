// components/history/TransactionCard.tsx

import { useState } from 'react';
import { Transaction } from '@/types/transaction';

interface Props {
	tx: Transaction;
}

export function HistoryCard({ tx }: Props) {
	const [open, setOpen] = useState(false);

	const isPositive = tx.amount > 0;

	return (
		<div className='rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900'>
			<button type='button' onClick={() => setOpen((prev) => !prev)} className='w-full p-5 text-left'>
				<div className='flex items-center justify-between gap-4'>
					<div>
						<div className='font-medium text-zinc-900 dark:text-white'>{tx.title || 'Transakcja'}</div>

						<div className='text-sm text-zinc-500'>Kod: {tx.code}</div>
					</div>

					<div className='text-right'>
						<div className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
							{tx.amount} {tx.currency}
						</div>

						<div className='text-xs text-zinc-500'>{new Date(tx.created_at).toLocaleDateString()}</div>

						<div className='text-xs text-zinc-400 mt-1'>{open ? 'Ukryj ▲' : 'Szczegóły ▼'}</div>
					</div>
				</div>
			</button>

			{open && (
				<div className='border-t border-zinc-200 px-5 pb-5 pt-4 text-sm dark:border-zinc-800'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-700 dark:text-zinc-300'>
						<div>
							<span className='text-zinc-500'>ID:</span> {tx.transaction_id}
						</div>

						<div>
							<span className='text-zinc-500'>Status:</span> {tx.status}
						</div>

						<div>
							<span className='text-zinc-500'>Typ:</span> {tx.type}
						</div>

						<div>
							<span className='text-zinc-500'>Waluta:</span> {tx.currency}
						</div>

						<div>
							<span className='text-zinc-500'>Nadawca:</span> {tx.sender_id}
						</div>

						<div>
							<span className='text-zinc-500'>Odbiorca:</span> {tx.receiver_id}
						</div>

						<div>
							<span className='text-zinc-500'>Data księgowania:</span>{' '}
							{new Date(tx.booking_date).toLocaleString()}
						</div>

						<div>
							<span className='text-zinc-500'>Utworzono:</span> {new Date(tx.created_at).toLocaleString()}
						</div>

						<div>
							<span className='text-zinc-500'>Zaktualizowano:</span>{' '}
							{new Date(tx.updated_at).toLocaleString()}
						</div>

						<div className='md:col-span-2'>
							<span className='text-zinc-500'>Opis:</span> {tx.description || '-'}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

import { Account } from '@/types/account';
import { useState } from 'react';

type Props = {
	account: Account;
};

export function AccountCard({ account }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<div className='rounded-2xl border bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800'>
			<div className='flex justify-between'>
				<div>
					<div className='font-semibold'>{account.name}</div>
					<div className='text-sm text-zinc-500'>{account.iban}</div>
				</div>

				<div className='text-right'>
					<div>
						{account.current_balance} {account.currency}
					</div>
					<div className='text-sm text-zinc-500'>Blokady: {account.blocked_amount ?? 0}</div>
				</div>
			</div>

			<button onClick={() => setOpen(!open)} className='mt-3 text-sm border px-3 py-1 rounded-xl'>
				{open ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
			</button>

			{open && (
				<div className='mt-3 text-sm text-zinc-500'>
					<div>ID: {account.account_id}</div>
					<div>Status: {account.status}</div>
				</div>
			)}
		</div>
	);
}

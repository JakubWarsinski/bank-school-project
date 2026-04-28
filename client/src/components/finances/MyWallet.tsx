import { Account } from '@/types/account';

export function MyWallet({ accounts }: { accounts: Account[] }) {
	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-semibold'>Lista kont</h1>

			<div className='grid md:grid-cols-2 gap-4'>
				{accounts.map((acc) => (
					<div
						key={acc.account_id}
						className='rounded-2xl border bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800'
					>
						<div className='text-lg font-semibold'>{acc.name}</div>

						<div className='text-zinc-500'>
							{acc.current_balance} {acc.currency}
						</div>

						<button className='mt-3 px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black'>
							Przejdź do konta
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

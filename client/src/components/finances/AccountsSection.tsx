import { Account } from '@/types/account';
import { AccountCard } from './AccountCard';

export function AccountsSection({ accounts }: { accounts: Account[] }) {
	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-semibold'>Rachunki indywidualne i wspólne</h1>

			{accounts.map((acc) => (
				<AccountCard key={acc.account_id} account={acc} />
			))}
		</div>
	);
}

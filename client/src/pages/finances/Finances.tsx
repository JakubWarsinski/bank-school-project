import { useEffect, useState } from 'react';
import { Header } from '@/components/header/Header';
import { cardApi } from '@/api/card';
import { accountApi } from '@/api/account';
import { MyWallet } from '@/components/finances/MyWallet';
import { AccountsSection } from '@/components/finances/AccountsSection';
import { CardsSection } from '@/components/finances/CardsSection';
import { Account } from '@/types/account';
import { Card } from '@/types/card';

type Tab = 'wallet' | 'accounts' | 'cards';

export default function Finances() {
	const [tab, setTab] = useState<Tab>('wallet');
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [cards, setCards] = useState<Card[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setLoading(true);

			const [acc, crd] = await Promise.all([accountApi.getMany({}), cardApi.getMany({})]);

			setAccounts(acc.items ?? []);
			setCards(crd.items ?? []);

			setLoading(false);
		})();
	}, []);

	return (
		<>
			<Header />

			<div className='max-w-6xl mx-auto p-6 space-y-6'>
				{/* MINI NAV */}
				<div className='flex gap-2'>
					<TabBtn label='Mój portfel' active={tab === 'wallet'} onClick={() => setTab('wallet')} />
					<TabBtn label='Konta' active={tab === 'accounts'} onClick={() => setTab('accounts')} />
					<TabBtn label='Karty' active={tab === 'cards'} onClick={() => setTab('cards')} />
				</div>

				{loading ? (
					<div className='text-center text-zinc-500'>Ładowanie...</div>
				) : (
					<>
						{tab === 'wallet' && <MyWallet accounts={accounts} />}
						{tab === 'accounts' && <AccountsSection accounts={accounts} />}
						{tab === 'cards' && <CardsSection cards={cards} />}
					</>
				)}
			</div>
		</>
	);
}

function TabBtn({ label, active, onClick }: any) {
	return (
		<button
			onClick={onClick}
			className={`px-4 py-2 rounded-xl text-sm ${
				active
					? 'bg-black text-white dark:bg-white dark:text-black'
					: 'border hover:bg-zinc-100 dark:hover:bg-zinc-800'
			}`}
		>
			{label}
		</button>
	);
}

import { useCallback, useEffect, useState } from 'react';
import { Transaction, TransactionType } from '@/types/transaction';
import { transactionApi } from '@/api/transaction';
import { Header } from '@/components/header/Header';
import { HistoryCard } from '@/components/history/HistoryCard';
import '@/assets/css/history.css';

export default function History() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [cursor, setCursor] = useState<number | null>(null);

	const [filters, setFilters] = useState({
		code: '',
		type: '',
		title: '',
		amount_gte: '',
		amount_lte: '',
		created_at_gte: '',
		created_at_lte: '',
	});

	const buildPayload = useCallback(
		(customCursor?: number) => ({
			cursor: customCursor,
			code: filters.code || undefined,
			type: (filters.type as TransactionType) || undefined,
			title: filters.title || undefined,
			amount_gte: filters.amount_gte ? Number(filters.amount_gte) : undefined,
			amount_lte: filters.amount_lte ? Number(filters.amount_lte) : undefined,
			created_at_gte: filters.created_at_gte ? new Date(filters.created_at_gte) : undefined,
			created_at_lte: filters.created_at_lte ? new Date(filters.created_at_lte) : undefined,
		}),
		[filters],
	);

	const fetchData = async () => {
		try {
			setLoading(true);

			const data = await transactionApi.getMany(buildPayload());

			setTransactions(data.items ?? []);
			setCursor(data.cursor ?? null);
		} finally {
			setLoading(false);
		}
	};

	const loadMore = async () => {
		if (!cursor || loadingMore) return;

		try {
			setLoadingMore(true);

			const data = await transactionApi.getMany(buildPayload(cursor));

			setTransactions((prev) => [...prev, ...(data.items ?? [])]);
			setCursor(data.cursor ?? null);
		} finally {
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<Header />

			<div className=''>
				<div className=''>
					<h1 className=''>Historia transakcji</h1>

					<button onClick={fetchData} className=''>
						Szukaj
					</button>
				</div>

				<div className=''>
					<div className=''>
						<input
							placeholder='Kod transakcji'
							className=''
							value={filters.code}
							onChange={(e) => setFilters((prev) => ({ ...prev, code: e.target.value }))}
						/>

						<input
							placeholder='Tytuł'
							className=''
							value={filters.title}
							onChange={(e) => setFilters((prev) => ({ ...prev, code: e.target.title }))}
						/>

						<input
							type='number'
							placeholder='Kwota od'
							className=''
							value={filters.amount_gte}
							onChange={(e) => setFilters({ ...filters, amount_gte: e.target.value })}
						/>

						<input
							type='number'
							placeholder='Kwota do'
							className=''
							value={filters.amount_lte}
							onChange={(e) => setFilters({ ...filters, amount_lte: e.target.value })}
						/>

						<input
							type='date'
							className=''
							value={filters.created_at_gte}
							onChange={(e) =>
								setFilters({
									...filters,
									created_at_gte: e.target.value,
								})
							}
						/>

						<input
							type='date'
							className=''
							value={filters.created_at_lte}
							onChange={(e) =>
								setFilters({
									...filters,
									created_at_lte: e.target.value,
								})
							}
						/>
					</div>
				</div>

				<div className=''>
					{loading ? (
						<div className='t'>Ładowanie...</div>
					) : transactions.length === 0 ? (
						<div className=''>Brak transakcji</div>
					) : (
						<>
							{transactions.map((tx) => (
								<HistoryCard key={tx.transaction_id} tx={tx} />
							))}

							{cursor && (
								<div className=''>
									<button onClick={loadMore} disabled={loadingMore} className=''>
										{loadingMore ? 'Ładowanie...' : 'Wczytaj więcej'}
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
}

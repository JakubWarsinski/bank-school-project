import { useEffect, useState } from 'react';
import { Transaction, TransactionType } from '@/types/transaction';
import { transactionApi } from '@/api/transaction';

export default function History() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);

	const [filters, setFilters] = useState({
		code: '',
		type: '',
		title: '',
		amount_gte: '',
		amount_lte: '',
		created_at_gte: '',
		created_at_lte: '',
	});

	const fetchData = async () => {
		setLoading(true);

		const data = await transactionApi.getMany({
			code: filters.code || undefined,
			type: (filters.type as TransactionType) || undefined,
			title: filters.title || undefined,

			amount_gte: filters.amount_gte ? Number(filters.amount_gte) : undefined,
			amount_lte: filters.amount_lte ? Number(filters.amount_lte) : undefined,

			created_at_gte: filters.created_at_gte ? new Date(filters.created_at_gte) : undefined,
			created_at_lte: filters.created_at_lte ? new Date(filters.created_at_lte) : undefined,
		});

		setTransactions(data.items ?? []);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<History />

			<div className='max-w-5xl mx-auto p-6 space-y-6'>
				{/* HEADER */}
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-semibold text-zinc-900 dark:text-white'>Historia transakcji</h1>

					<button
						onClick={fetchData}
						className='px-4 py-2 rounded-xl text-white text-sm hover:opacity-90 dark:bg-white dark:text-black'
					>
						Szukaj
					</button>
				</div>

				{/* FILTER PANEL */}
				<div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{/* CODE */}
						<input
							placeholder='Kod transakcji'
							className='p-3 border rounded-xl dark:bg-zinc-800'
							value={filters.code}
							onChange={(e) => setFilters({ ...filters, code: e.target.value })}
						/>

						{/* TYPE */}
						<select
							className='p-3 border rounded-xl dark:bg-zinc-800'
							value={filters.type}
							onChange={(e) => setFilters({ ...filters, type: e.target.value })}
						>
							<option value=''>Typ (wszystkie)</option>
							<option value='TRANSFER'>TRANSFER</option>
							<option value='DEPOSIT'>DEPOSIT</option>
							<option value='WITHDRAW'>WITHDRAW</option>
						</select>

						{/* TITLE */}
						<input
							placeholder='Tytuł'
							className='p-3 border rounded-xl dark:bg-zinc-800'
							value={filters.title}
							onChange={(e) => setFilters({ ...filters, title: e.target.value })}
						/>

						{/* AMOUNT FROM */}
						<input
							type='number'
							placeholder='Kwota od'
							className='p-3 border rounded-xl dark:bg-zinc-800'
							value={filters.amount_gte}
							onChange={(e) => setFilters({ ...filters, amount_gte: e.target.value })}
						/>

						{/* AMOUNT TO */}
						<input
							type='number'
							placeholder='Kwota do'
							className='p-3 border rounded-xl dark:bg-zinc-800'
							value={filters.amount_lte}
							onChange={(e) => setFilters({ ...filters, amount_lte: e.target.value })}
						/>

						{/* DATE FROM */}
						<input
							type='date'
							className='p-3 border rounded-xl dark:bg-zinc-800'
							value={filters.created_at_gte}
							onChange={(e) => setFilters({ ...filters, created_at_gte: e.target.value })}
						/>

						{/* DATE TO */}
						<input
							type='date'
							className='p-3 border rounded-xl dark:bg-zinc-800'
							value={filters.created_at_lte}
							onChange={(e) => setFilters({ ...filters, created_at_lte: e.target.value })}
						/>
					</div>
				</div>

				{/* LIST */}
				<div className='space-y-3'>
					{loading ? (
						<div className='text-center text-zinc-500'>Ładowanie...</div>
					) : transactions.length === 0 ? (
						<div className='text-center text-zinc-500'>Brak transakcji</div>
					) : (
						transactions.map((tx) => (
							<div
								key={tx.transaction_id}
								className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
							>
								<div className='flex items-center justify-between'>
									<div>
										<div className='font-medium text-zinc-900 dark:text-white'>
											{tx.title ?? 'Transakcja'}
										</div>

										<div className='text-sm text-zinc-500'>Kod: {tx.code}</div>
									</div>

									<div className='text-right'>
										<div
											className={`font-semibold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}
										>
											{tx.amount} PLN
										</div>

										<div className='text-xs text-zinc-500'>
											{new Date(tx.created_at).toLocaleDateString()}
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
}

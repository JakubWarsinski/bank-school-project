import { useEffect, useState } from 'react';
import { Header } from '@/components/header/Header';
import { transactionApi } from '@/api/transaction';
import { accountApi } from '@/api/account';
import { getUser } from '@/common/utils/auth';
import { z } from 'zod';
import { transactionSchema } from '@/schemas/transaction';
import { Account } from '@/types/account';

type Form = z.infer<typeof transactionSchema>;

export default function Transaction() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
	const [openAccounts, setOpenAccounts] = useState(false);

	const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

	const [form, setForm] = useState<Form>({
		type: 'INTERNAL_TRANSFER',
		title: '',
		description: '',
		amount: 0,
		currency: 'PLN',
		receiver_iban: '',
	});

	const senderIban = accounts.find((a) => a.account_id === selectedAccountId)?.iban || '';

	useEffect(() => {
		(async () => {
			const u = getUser();
			if (!u?.id) return;

			const res = await accountApi.getMany({});

			setAccounts(res.items ?? []);
		})();
	}, []);

	// FULL VALIDATION
	const validateForm = () => {
		const result = transactionSchema.safeParse(form);

		if (result.success) {
			setErrors({});
			return true;
		}

		const fieldErrors: Partial<Record<keyof Form, string>> = {};

		result.error.issues.forEach((err) => {
			const field = err.path[0] as keyof Form;
			fieldErrors[field] = err.message;
		});

		setErrors(fieldErrors);
		return false;
	};

	// SINGLE FIELD VALIDATION (live + blur)
	const validateField = (field: keyof Form, value: any) => {
		const temp = {
			...form,
			[field]: field === 'amount' ? Number(value) : value,
		};

		const result = transactionSchema.safeParse(temp);

		if (result.success) {
			setErrors((prev) => {
				const copy = { ...prev };
				delete copy[field]; // 👈 kluczowe
				return copy;
			});
			return;
		}

		const fieldError = result.error.issues.find((e) => e.path[0] === field);

		setErrors((prev) => {
			const copy = { ...prev };

			if (fieldError) {
				copy[field] = fieldError.message;
			} else {
				delete copy[field]; // 👈 ważne też gdy pole już OK
			}

			return copy;
		});
	};

	const handleChange = (key: keyof Form, value: any) => {
		const val = key === 'amount' ? Number(value) : value;

		setForm((p) => ({
			...p,
			[key]: val,
		}));

		validateField(key, val);
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		setMessage(null);
		setError(null);

		try {
			await transactionApi.create({
				...form,
				sender_iban: senderIban,
			});

			setMessage('✅ Transakcja udana');

			setForm({
				type: 'INTERNAL_TRANSFER',
				title: '',
				description: '',
				amount: 0,
				currency: 'PLN',
				receiver_iban: '',
			});
		} catch {
			setError('❌ Transakcja nieudana');
		} finally {
			setLoading(false);
		}
	};

	// INPUT WRAPPER STYLE (spójność UI)
	const inputClass = (hasError?: boolean) =>
		`w-full p-3 border rounded-xl bg-white dark:bg-zinc-800 dark:border-zinc-700 focus:outline-none focus:ring-2 ${
			hasError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 focus:ring-blue-500'
		}`;

	return (
		<>
			<Header />

			<div className='max-w-3xl mx-auto p-6 space-y-6'>
				<div className='space-y-5 rounded-2xl border bg-white p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-800'>
					<div className='relative'>
						{/* TRIGGER */}
						<button
							type='button'
							onClick={() => setOpenAccounts((p) => !p)}
							className='w-full p-3 border rounded-xl bg-white dark:bg-zinc-800 dark:border-zinc-700 text-left'
						>
							{selectedAccountId ? (
								(() => {
									const acc = accounts.find((a) => a.account_id === selectedAccountId);

									if (!acc) return 'Wybierz konto';

									return (
										<div className='flex items-center justify-between'>
											{/* LEFT */}
											<div className='flex flex-col'>
												<span className='font-medium text-sm'>{acc.name}</span>
												<span className='text-xs text-zinc-500'>{acc.iban}</span>
											</div>

											{/* RIGHT */}
											<div className='text-sm font-semibold'>
												{acc.current_balance} {acc.currency}
											</div>
										</div>
									);
								})()
							) : (
								<span className='text-zinc-400'>Wybierz konto</span>
							)}
						</button>

						{/* DROPDOWN */}
						{openAccounts && (
							<div className='absolute z-50 mt-2 w-full rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-lg overflow-hidden'>
								{accounts.map((acc) => (
									<div
										key={acc.account_id}
										onClick={() => {
											setSelectedAccountId(acc.account_id);
											setOpenAccounts(false);
										}}
										className='flex items-center justify-between p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
									>
										{/* LEFT SIDE */}
										<div className='flex flex-col'>
											<span className='font-medium text-sm'>{acc.name}</span>
											<span className='text-xs text-zinc-500'>{acc.iban}</span>
										</div>

										{/* RIGHT SIDE */}
										<div className='text-sm font-semibold text-right'>
											{acc.current_balance} PLN
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* RECEIVER IBAN */}
					<div className='space-y-1'>
						<input
							className={inputClass(!!errors.receiver_iban)}
							placeholder='IBAN odbiorcy'
							value={form.receiver_iban}
							onChange={(e) => handleChange('receiver_iban', e.target.value)}
							onBlur={(e) => validateField('receiver_iban', e.target.value)}
						/>
						{errors.receiver_iban && <span className='text-red-500 text-xs'>{errors.receiver_iban}</span>}
					</div>

					{/* AMOUNT */}
					<div className='space-y-1'>
						<input
							type='number'
							className={inputClass(!!errors.amount)}
							placeholder='Kwota'
							value={form.amount}
							onChange={(e) => handleChange('amount', e.target.value)}
							onBlur={(e) => validateField('amount', e.target.value)}
						/>
						{errors.amount && <span className='text-red-500 text-xs'>{errors.amount}</span>}
					</div>

					{/* TITLE */}
					<div className='space-y-1'>
						<input
							className={inputClass(!!errors.title)}
							placeholder='Tytuł'
							value={form.title}
							onChange={(e) => handleChange('title', e.target.value)}
							onBlur={(e) => validateField('title', e.target.value)}
						/>
						{errors.title && <span className='text-red-500 text-xs'>{errors.title}</span>}
					</div>

					{/* TYPE */}
					<div className='space-y-1'>
						<select
							className={inputClass(!!errors.type)}
							value={form.type}
							onChange={(e) => handleChange('type', e.target.value)}
						>
							<option value='INTERNAL_TRANSFER'>Przelew wewnętrzny</option>
							<option value='CARD_PAYMENT'>Płatność kartą</option>
							<option value='CARD_WITHDRAWAL'>Wypłata kartą</option>
							<option value='ADJUSTMENT'>Korekta</option>
							<option value='REVERSAL'>Storno (odwrócenie)</option>
						</select>
					</div>

					{/* DESCRIPTION */}
					<div className='space-y-1'>
						<textarea
							className={inputClass(!!errors.description)}
							placeholder='Opis'
							value={form.description}
							onChange={(e) => handleChange('description', e.target.value)}
							onBlur={(e) => validateField('description', e.target.value)}
						/>
						{errors.description && <span className='text-red-500 text-xs'>{errors.description}</span>}
					</div>

					{/* BUTTON */}
					<button
						onClick={handleSubmit}
						disabled={loading || !senderIban}
						className='w-full px-4 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black disabled:opacity-50'
					>
						{loading ? 'Wysyłanie...' : 'Wyślij przelew'}
					</button>

					{/* INFO */}

					{message && <div className='text-green-500 text-sm'>{message}</div>}

					{error && <div className='text-red-500 text-sm'>{error}</div>}
				</div>
			</div>
		</>
	);
}

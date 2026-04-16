import { LedgerType } from '../../prisma/generated/prisma/enums';

export const LedgerAccountData = {
	name: 'Sending',
	type: LedgerType.EXPENSE,
	balance: 0,
	currency: 'PLN',
	is_active: true,
	created_at: new Date(),
	updated_at: new Date(),
};

export const CreateLedgerAccountData = {
	code: 'BNK001',
	name: 'Sending',
	type: LedgerType.EXPENSE,
	currency: 'PLN',
};

export const InvalidLedgerAccountData = {
	code: ['', 'a', 123, 'a'.repeat(7)],
	name: ['', 'aaaa', 123, 'a'.repeat(51)],
	type: ['', 'a', 123],
	currency: ['', 'A', 'a'.repeat(4)],
};

export const SkipLedgerAccountQuery = ['ledger_id'];

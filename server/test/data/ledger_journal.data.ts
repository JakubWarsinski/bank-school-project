import { StatusType } from '../../prisma/generated/prisma/enums';

export const LedgerJournalData = {
	description: 'Description',
	total_amount: 0,
	currency: 'PLN',
	status: StatusType.PENDING,
	created_at: new Date(),
	updated_at: new Date(),
};

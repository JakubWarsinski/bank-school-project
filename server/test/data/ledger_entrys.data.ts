import { EntryType } from '../../prisma/generated/prisma/enums';

export const LedgerEntryData = {
	amount: 0,
	type: EntryType.CREDIT,
	description: 'Description',
	created_at: new Date(),
	updated_at: new Date(),
};

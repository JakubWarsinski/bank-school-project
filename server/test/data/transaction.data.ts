import { StatusType } from '../../prisma/generated/prisma/enums';

export const TransactionData = {
	status: StatusType.PENDING,
	title: 'Title',
	description: 'Description',
	amount: 500,
	currency: 'PLN',
	booking_date: new Date(),
	created_at: new Date(),
};

export const CreateTransactionData = {
	title: 'Title',
	description: 'Description',
	amount: 100,
	currency: 'PLN',
};

export const InvalidTransactionData = {
	title: ['aaaa', 123, 'a'.repeat(81)],
	description: ['aaaa', 123, 'a'.repeat(255)],
	amount: ['', 'a'],
	currency: ['', 'A', 123, 'a'.repeat(4)],
	receiver_number: ['', 'A', 123, 'a'.repeat(29)],
};

export const SkipTransactionQuery = ['transaction_id'];

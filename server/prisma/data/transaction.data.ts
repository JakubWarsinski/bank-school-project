import { StatusType, TransactionType } from '../generated/prisma/enums';

export const statusTypes = Object.values(StatusType);
export const transactionTypes = Object.values(TransactionType);

export const transactionTitles = ['Przelew środków', 'Zakup usługi', 'Płatność online', 'Zwrot środków'];

export const transactionDescriptions = [
	'Standardowa transakcja finansowa',
	'Operacja wykonana przez użytkownika',
	'Automatyczne rozliczenie systemowe',
	'Przelew między kontami',
];

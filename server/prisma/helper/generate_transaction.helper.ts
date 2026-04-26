import { StatusType, TransactionType } from '../generated/prisma/enums';
import { generateRandomDate, generateRandomDigits, generateRandomInt, pickRandom } from './random_generator.helper';
import { statusTypes, transactionDescriptions, transactionTitles, transactionTypes } from '../data/transaction.data';

export const generateTransaction = (
	sender_id: number,
	receiver_id: number,
	status?: StatusType,
	type?: TransactionType,
	amount?: number,
	booking_date?: Date,
) => {
	return {
		code: `TRA${generateRandomDigits(27)}`,
		status: !status ? pickRandom(statusTypes) : status,
		type: !type ? pickRandom(transactionTypes) : type,
		sender_id,
		receiver_id,
		title: pickRandom(transactionTitles),
		description: pickRandom(transactionDescriptions),
		booking_date: !booking_date ? new Date() : booking_date,
		amount: !amount ? generateRandomInt(1000, 5000) : amount,
		currency: 'PLN',
		created_at: generateRandomDate(new Date(2015, 0, 1), new Date(2023, 11, 31)),
		updated_at: generateRandomDate(new Date(2015, 0, 1), new Date(2023, 11, 31)),
	};
};

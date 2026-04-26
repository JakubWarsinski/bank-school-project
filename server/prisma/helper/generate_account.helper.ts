import { CountryCode, IBAN } from 'ibankit';
import { AccountStatus } from '../generated/prisma/enums';
import { generateRandomDate, generateRandomInt } from './random_generator.helper';

export const generateAccount = (
	status?: AccountStatus,
	current_balance?: number,
	blocked_amount?: number,
	daily_transfer_limit?: number,
	closed_at?: Date,
	closed_reason?: string,
) => {
	const balance = !current_balance ? generateRandomInt(0, 50000) : current_balance;

	return {
		iban: IBAN.random(CountryCode.PL).toString(),
		status: !status ? AccountStatus.ACTIVE : status,
		currency: 'PLN',
		current_balance: balance,
		available_balance: balance,
		blocked_amount,
		daily_transfer_limit: !daily_transfer_limit ? generateRandomInt(balance, 50000) : daily_transfer_limit,
		closed_at,
		closed_reason,
		created_at: generateRandomDate(new Date(2015, 0, 1), new Date(2023, 11, 31)),
		updated_at: generateRandomDate(new Date(2015, 0, 1), new Date(2023, 11, 31)),
	};
};

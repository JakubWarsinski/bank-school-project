import * as argon2 from 'argon2';
import { CardStatus } from '../generated/prisma/enums';
import { generateRandomDigits, generateRandomInt } from './random_generator.helper';

export const generateCard = async (
	account_id: number,
	status?: CardStatus,
	card_number?: string,
	cvv?: string,
	pin?: string,
	expiry_month?: number,
	expiry_year?: number,
	payment_limit?: number,
	withdraw_limit?: number,
	daily_payment_limit?: number,
	daily_withdraw_limit?: number,
	blocked_at?: Date,
	blocked_reason?: string,
) => {
	const plainCardNumber = !card_number ? generateRandomDigits(16) : card_number;
	const plainCvv = !cvv ? generateRandomDigits(3) : cvv;
	const plainPin = !pin ? generateRandomDigits(4) : pin;

	const card_number_hash = await argon2.hash(plainCardNumber);
	const cvv_hash = await argon2.hash(plainCvv);
	const pin_hash = await argon2.hash(plainPin);

	const last_digits = plainCardNumber.slice(-4);

	const now = new Date();

	const payment = !payment_limit ? generateRandomInt(1000, 20000) : payment_limit;
	const withdraw = !withdraw_limit ? generateRandomInt(500, 10000) : withdraw_limit;

	return {
		account_id,
		status: !status ? CardStatus.ACTIVE : status,
		card_number_hash,
		last_digits,
		cvv_hash,
		pin_hash,
		expiry_month: !expiry_month ? generateRandomInt(1, 12) : expiry_month,
		expiry_year: !expiry_year ? now.getFullYear() + generateRandomInt(2, 6) : expiry_year,
		payment_limit: payment,
		withdraw_limit: withdraw,
		daily_payment_limit: !daily_payment_limit ? generateRandomInt(1000, payment) : daily_payment_limit,
		daily_withdraw_limit: !daily_withdraw_limit ? generateRandomInt(500, withdraw) : daily_withdraw_limit,
		blocked_at,
		blocked_reason,
	};
};

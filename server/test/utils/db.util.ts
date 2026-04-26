import { PrismaService } from '../../src/prisma/prisma.service';
import {
	AccountRole,
	AccountStatus,
	CardStatus,
	StatusType,
	TransactionType,
	UserRole,
} from '../../prisma/generated/prisma/enums';
import { generateUser } from '../../prisma/helper/generate_user.helper';
import { generateAccount } from '../../prisma/helper/generate_account.helper';
import { generateUserAccount } from '../../prisma/helper/generate_user_account.helper';
import { generateCard } from '../../prisma/helper/generate_card.helper';
import { generateNotification } from '../../prisma/helper/generate_notification.helper';
import { generateTransaction } from '../../prisma/helper/generate_transaction.helper';

export class DbHelper {
	constructor(private readonly prisma: PrismaService) {}

	async createUser(role?: UserRole, email?: string, password?: string, is_active?: boolean) {
		return await this.prisma.user.create({
			data: await generateUser(role, email, password, is_active),
		});
	}

	async createAccount(
		status?: AccountStatus,
		current_balance?: number,
		blocked_amount?: number,
		daily_transfer_limit?: number,
		closed_at?: Date,
		closed_reason?: string,
	) {
		return await this.prisma.account.create({
			data: generateAccount(
				status,
				current_balance,
				blocked_amount,
				daily_transfer_limit,
				closed_at,
				closed_reason,
			),
		});
	}

	async createUserAccount(user_id: number, account_id: number, role?: AccountRole) {
		return await this.prisma.userAccount.create({
			data: generateUserAccount(user_id, account_id, role),
		});
	}

	async createCard(
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
	) {
		return await this.prisma.card.create({
			data: await generateCard(
				account_id,
				status,
				card_number,
				cvv,
				pin,
				expiry_month,
				expiry_year,
				payment_limit,
				withdraw_limit,
				daily_payment_limit,
				daily_withdraw_limit,
				blocked_at,
				blocked_reason,
			),
		});
	}

	async createNotification(user_id: number) {
		return await this.prisma.notification.create({
			data: generateNotification(user_id),
		});
	}

	async createTransaction(
		sender_id: number,
		receiver_id: number,
		status?: StatusType,
		type?: TransactionType,
		amount?: number,
		booking_date?: Date,
	) {
		return await this.prisma.transaction.create({
			data: generateTransaction(sender_id, receiver_id, status, type, amount, booking_date),
		});
	}
}

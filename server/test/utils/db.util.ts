import * as argon2 from 'argon2';
import { CardData } from '../data/card.data';
import { UserData } from '../data/user.data';
import { AccountData } from '../data/account.data';
import { PrismaService } from '@/prisma/prisma.service';
import { TransactionData } from '../data/transaction.data';
import { LedgerAccountData } from '../data/ledger_account.data';
import { LedgerJournalData } from '../data/ledger_journal.data';
import { LedgerEntryData } from '../data/ledger_entrys.data';
import { CountryCode, IBAN } from 'ibankit';
import { AccountRole, UserRole } from '../../prisma/generated/prisma/enums';

export class DbHelper {
	constructor(private readonly prisma: PrismaService) {}

	private generateRandomDigits(limit: number): string {
		return Array.from({ length: limit }, () => Math.floor(Math.random() * 10)).join('');
	}

	async clearTables(tables: string[]) {
		await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE;`);
	}

	async createUser(role: UserRole = 'USER', password: string = 'TestPassword123!') {
		const dto = UserData;

		return await this.prisma.user.create({
			data: {
				...dto,
				code: this.generateRandomDigits(16),
				email: `${this.generateRandomDigits(8)}@test.pl`,
				pesel: this.generateRandomDigits(11),
				password_hash: await argon2.hash(password),
				role,
			},
		});
	}

	async createAccount(userId?: string) {
		const dto = AccountData;

		const iban = IBAN.random(CountryCode.PL).toString();

		const account = await this.prisma.account.create({
			data: {
				...dto,
				iban,
			},
		});

		if (userId) await this.addUserToAccount(account.account_id, userId, 'OWNER');

		return account;
	}

	async addUserToAccount(accountId: string, userId: string, role: AccountRole = AccountRole.CO_OWNER) {
		await this.prisma.userAccount.create({
			data: { account_id: accountId, user_id: userId, role },
		});
	}

	async createCard(accountId: string) {
		const dto = CardData;

		return await this.prisma.card.create({
			data: { ...dto, account_id: accountId },
		});
	}

	async createTransaction(accountId: string, senderId: string) {
		const dto = TransactionData;

		return await this.prisma.transaction.create({
			data: {
				...dto,
				code: this.generateRandomDigits(30),
				sender_id: senderId,
				receiver_id: accountId,
			},
		});
	}

	async createLedgerAccount() {
		const dto = LedgerAccountData;

		return await this.prisma.ledgerAccount.create({
			data: {
				...dto,
				code: this.generateRandomDigits(6),
			},
		});
	}

	async createLedgerJournal(transactionId: string) {
		const dto = LedgerJournalData;

		return await this.prisma.ledgerJournal.create({
			data: {
				...dto,
				amount: 0,
				transaction_id: transactionId,
			},
		});
	}

	async createLedgerEntry(accountId: string, journalId: string) {
		const dto = LedgerEntryData;

		return await this.prisma.ledgerEntry.create({
			data: {
				...dto,
				journal_id: journalId,
				account_id: accountId,
			},
		});
	}
}

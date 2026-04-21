import crypto from 'crypto';
import { IBAN } from 'ibankit';
import { GetTransactionDto } from './dto/get.dto';
import { PostTransactionDto } from './dto/post.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { AccountService } from '../accounts/account.service';
import { JwtData } from '../auth/strategies/access.strategy';
import { buildWhere } from '@/common/helpers/build_where.helper';
import { handlePrismaError } from '@/common/exceptions/prisma.exception';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { TransactionWhereInput, TransactionWhereUniqueInput } from '@db/generated/prisma/models';
import { buildPage } from '@/common/helpers/build_page.helper';

@Injectable()
export class TransactionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly accountService: AccountService,
	) {}

	async findUnique(where: TransactionWhereUniqueInput, jwt?: JwtData) {
		try {
			if (jwt && jwt.role === 'CLIENT') {
				where.OR = this.canAccess(jwt);
			}

			const transaction = await this.prisma.transaction.findUnique({ where });

			if (!transaction) {
				throw new ForbiddenException('Transakcja nie istnieje, lub nie posiadasz do niej dostępu.');
			}

			return transaction;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async findMany(dto: GetTransactionDto, jwt?: JwtData) {
		try {
			const { cursor, limit, ...filters } = dto;

			const where: TransactionWhereInput = buildWhere(filters, ['status', 'transaction_code']);

			if (jwt && jwt.role === 'CLIENT') {
				where.OR = this.canAccess(jwt);
			}

			const transactions = await this.prisma.transaction.findMany({
				where,
				take: limit + 1,
				cursor: cursor ? { transaction_id: cursor } : undefined,
				orderBy: { transaction_id: 'asc' },
			});

			return buildPage(transactions, limit, 'transaction_id');
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async create(dto: PostTransactionDto, jwt?: JwtData) {
		try {
			const { sender_iban, receiver_iban, ...data } = dto;

			if (!IBAN.isValid(receiver_iban)) {
				throw new BadRequestException('IBAN odbiorcy jest nieprawidłowy.');
			}

			if (!IBAN.isValid(sender_iban)) {
				throw new BadRequestException('IBAN nadawcy jest nieprawidłowy.');
			}

			if (sender_iban === receiver_iban) {
				throw new ForbiddenException('Nie możesz wysłać środków na to samo konto.');
			}

			const sender = await this.accountService.findUnique({ iban: sender_iban }, jwt);
			const receiver = await this.accountService.findUnique({ iban: receiver_iban });

			const limit = Number(sender.daily_transfer_limit);
			const blocked_amount = Number(sender.blocked_amount);
			const avaible_balance = Number(sender.available_balance);

			if (data.amount <= 0) {
				throw new BadRequestException('Kwota musi być większa od zera.');
			}

			if (avaible_balance < data.amount || avaible_balance - blocked_amount < data.amount) {
				throw new ForbiddenException('Brak wystarczającej ilości środków na końcie.');
			}

			if (data.amount > limit) {
				throw new ForbiddenException('Przekroczono limit wielkości środków do przesłania.');
			}

			const code = await this.createTransactionCode();

			return await this.prisma.transaction.create({
				data: {
					...data,
					sender_id: sender.account_id,
					receiver_id: receiver.account_id,
					code,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}

	private canAccess(jwt: JwtData) {
		return [
			{
				sender: {
					users: {
						some: {
							user_id: jwt.id,
						},
					},
				},
			},
			{
				receiver: {
					users: {
						some: {
							user_id: jwt.id,
						},
					},
				},
			},
		];
	}

	private async createTransactionCode() {
		const prefix = 'TRA';
		const year = new Date().getFullYear().toString();

		const count = await this.prisma.transaction.count();
		const nextNumber = (count + 1).toString();

		const fixedPart = `${prefix}${year}${nextNumber}`;

		const remaining = Math.max(30 - fixedPart.length, 0);

		let randomFill = '';

		for (let i = 0; i < remaining; i++) {
			randomFill += crypto.randomInt(0, 10).toString();
		}

		return `${fixedPart}${randomFill}`.slice(0, 30);
	}
}

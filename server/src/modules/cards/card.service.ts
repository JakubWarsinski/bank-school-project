import crypto from 'crypto';
import * as argon2 from 'argon2';
import { GetCardDto } from './dto/get.dto';
import { PostCardDto } from './dto/post.dto';
import { PatchCardDto } from './dto/patch.dto';
import { JwtData } from '../auth/strategies/access.strategy';
import { AccountService } from '../accounts/account.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { handlePrismaError } from '../../common/exceptions/prisma.exception';
import { buildWhere } from '../../common/helpers/build_where.helper';
import { buildPage } from '../../common/helpers/build_page.helper';

@Injectable()
export class CardService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly accountService: AccountService,
	) {}

	async findUnique(where: Prisma.CardWhereUniqueInput, jwt?: JwtData) {
		try {
			if (jwt && jwt.role === 'CLIENT') {
				where.account = {
					users: {
						some: {
							user_id: jwt.id,
						},
					},
				};
			}

			const card = await this.prisma.card.findUnique({
				where,
				omit: {
					card_number_hash: true,
					cvv_hash: true,
					pin_hash: true,
				},
			});

			if (!card) {
				throw new ForbiddenException('Karta nie istnieje, lub nie posiadasz do niej dostępu.');
			}

			return card;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async findMany(dto: GetCardDto, jwt?: JwtData) {
		try {
			const { cursor, limit, ...filters } = dto;

			const where: Prisma.CardWhereInput = buildWhere(filters, ['status']);

			if (jwt && jwt.role === 'CLIENT') {
				where.account = {
					users: {
						some: {
							user_id: jwt.id,
						},
					},
				};
			}

			const cards = await this.prisma.card.findMany({
				where,
				take: limit + 1,
				cursor: cursor ? { card_id: cursor } : undefined,
				orderBy: { card_id: 'asc' },
				omit: {
					card_number_hash: true,
					cvv_hash: true,
					pin_hash: true,
				},
			});

			return buildPage(cards, limit, 'card_id');
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async patch(id: number, dto: PatchCardDto, jwt?: JwtData) {
		try {
			const where: Prisma.CardWhereUniqueInput = { card_id: id };

			if (jwt && jwt.role === 'CLIENT') {
				where.account = {
					users: {
						some: {
							user_id: jwt.id,
						},
					},
				};
			}

			const { pin, ...cardData } = dto;

			const data: Prisma.CardUpdateInput = cardData;

			if (pin) {
				data.pin_hash = await argon2.hash(pin);
			}

			return await this.prisma.card.update({
				where,
				data,
				omit: {
					card_number_hash: true,
					cvv_hash: true,
					pin_hash: true,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async create(dto: PostCardDto) {
		try {
			await this.accountService.findUnique({ account_id: dto.account_id });

			const cardData = await this.createCardNumber();

			const now = new Date();
			const expiryMonthIndex = now.getMonth() + 24;

			const expiry_year = now.getFullYear() + Math.floor(expiryMonthIndex / 12);
			const expiry_month = (expiryMonthIndex % 12) + 1;

			const data = {
				expiry_month,
				expiry_year,
				...cardData,
				...dto,
			};

			return await this.prisma.card.create({
				data,
				omit: {
					card_number_hash: true,
					cvv_hash: true,
					pin_hash: true,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}

	private generateRandomNumbers(amount: number): string {
		let numbers = '';

		for (let i = 0; i < amount; i++) {
			numbers += crypto.randomInt(0, 10).toString();
		}

		return numbers;
	}

	private async createCardNumber() {
		const count = await this.prisma.card.count();
		const nextNumber = (count + 1).toString();
		const remaining = Math.max(16 - nextNumber.length, 0);

		const randomFill = this.generateRandomNumbers(remaining);

		const cardNumber = `${nextNumber}${randomFill}`.slice(0, 20);
		const pin = this.generateRandomNumbers(4);
		const cvv = this.generateRandomNumbers(3);

		const lastDigits = cardNumber.slice(-4);

		const [pin_hash, cvv_hash, card_number_hash] = await Promise.all([
			argon2.hash(pin),
			argon2.hash(cvv),
			argon2.hash(cardNumber),
		]);

		return { pin_hash, cvv_hash, card_number_hash, last_digits: lastDigits };
	}
}

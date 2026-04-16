import { CountryCode, IBAN } from 'ibankit';
import { GetAccountDto } from './dto/get.dto';
import { AddAccountDto } from './dto/add.dto';
import { PostAccountDto } from './dto/post.dto';
import { PatchAccountDto } from './dto/patch.dto';
import { UserService } from '../users/users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AccountStatus } from '@db/generated/prisma/enums';
import { JwtData } from '../auth/strategies/access.strategy';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { buildWhere } from '@/common/helpers/build_where.helper';
import { handlePrismaError } from '@/common/exceptions/prisma.exception';
import { AccountWhereInput, AccountWhereUniqueInput } from '@db/generated/prisma/models';

@Injectable()
export class AccountService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
	) {}

	async findUnique(where: AccountWhereUniqueInput, jwt?: JwtData) {
		try {
			if (jwt && jwt.role === 'CLIENT') {
				where.users = {
					some: { user_id: jwt.id },
				};
			}

			const account = await this.prisma.account.findUnique({ where });

			if (!account) {
				throw new ForbiddenException('Konto nie istnieje, lub nie posiadasz do niego dostępu.');
			}

			if (account.status !== 'ACTIVE') {
				throw new ForbiddenException('Konto jest zablokowane lub nieaktywne.');
			}

			return account;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async findMany(dto: GetAccountDto, jwt?: JwtData) {
		try {
			const { cursor, limit, ...filters } = dto;

			const where: AccountWhereInput = buildWhere(filters, ['status', 'iban']);

			if (jwt && jwt.role === 'CLIENT') {
				where.users = {
					some: { user_id: jwt.id },
				};
			}

			const accounts = await this.prisma.account.findMany({
				where,
				take: limit + 1,
				cursor: cursor ? { account_id: cursor } : undefined,
				orderBy: { account_id: 'asc' },
			});

			if (accounts.length > limit) {
				return {
					accounts: accounts.slice(0, limit),
					cursor: accounts[limit].account_id,
				};
			}

			return {
				accounts: accounts,
				cursor: null,
			};
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async patch(id: number, dto: PatchAccountDto, jwt?: JwtData) {
		try {
			const where: AccountWhereUniqueInput = {
				account_id: id,
			};

			if (jwt && jwt.role === 'CLIENT') {
				where.users = {
					some: { user_id: jwt.id },
				};
			}

			return await this.prisma.account.update({
				where,
				data: dto,
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async create(dto: PostAccountDto) {
		try {
			const user = await this.userService.findUnique({ user_id: dto.user_id });

			const iban = IBAN.random(CountryCode.PL).toString();

			const account = await this.prisma.account.create({
				data: {
					iban,
					currency: dto.currency,
				},
			});

			await this.prisma.userAccount.create({
				data: {
					account_id: account.account_id,
					user_id: user.user_id,
					role: 'OWNER',
				},
			});

			return account;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async addUser(id: number, dto: AddAccountDto) {
		try {
			const user = await this.userService.findUnique({ user_id: dto.user_id });

			const account = await this.findUnique({ account_id: id });

			await this.prisma.userAccount.create({
				data: {
					account_id: account.account_id,
					user_id: user.user_id,
					role: 'CO_OWNER',
				},
			});

			return { user, account };
		} catch (error) {
			handlePrismaError(error);
		}
	}
}

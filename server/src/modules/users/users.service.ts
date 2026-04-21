import crypto from 'crypto';
import * as argon2 from 'argon2';
import { GetUserDto } from './dto/get.dto';
import { PatchUserDto } from './dto/patch';
import { PostUserDto } from './dto/post.dto';
import { UserRole } from '@db/generated/prisma/enums';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtData } from '../auth/strategies/access.strategy';
import { buildWhere } from '@/common/helpers/build_where.helper';
import { handlePrismaError } from '@/common/exceptions/prisma.exception';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserUpdateInput, UserWhereInput, UserWhereUniqueInput } from '@db/generated/prisma/models';
import { buildPage } from '@/common/helpers/build_page.helper';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async findUnique(where: UserWhereUniqueInput, jwt?: JwtData) {
		try {
			if (jwt && where.user_id) {
				this.canAccess(jwt.role, jwt.id, where.user_id);
			}

			const user = await this.prisma.user.findUnique({
				where,
				...(jwt !== null && {
					omit: {
						password_hash: true,
					},
				}),
			});

			if (!user) {
				throw new ForbiddenException('Użytkownik nie istnieje, lub nie posiadasz do niego dostępu.');
			}

			return user;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async findMany(dto: GetUserDto) {
		try {
			const { cursor, limit, ...filters } = dto;

			const where: UserWhereInput = buildWhere(filters, ['role']);

			const users = await this.prisma.user.findMany({
				where,
				take: limit + 1,
				cursor: cursor ? { user_id: cursor } : undefined,
				orderBy: {
					user_id: 'asc',
				},
				omit: {
					password_hash: true,
				},
			});

			return buildPage(users, limit, 'user_id');
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async patch(id: number, dto: PatchUserDto, jwt?: JwtData) {
		try {
			if (jwt) {
				this.canAccess(jwt.role, jwt.id, id);
			}

			const { password, ...userData } = dto;

			const data: UserUpdateInput = userData;

			if (password) {
				data.password_hash = await this.checkPassword(password);
			}

			return await this.prisma.user.update({
				data,
				where: {
					user_id: id,
				},
				omit: {
					password_hash: true,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async create(dto: PostUserDto) {
		try {
			const code = await this.createUserCode();

			const data = { code, ...dto, is_active: false };

			return await this.prisma.user.create({
				data,
				omit: {
					password_hash: true,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async verifyPassword(where: UserWhereUniqueInput, password: string) {
		const user = await this.prisma.user.findUnique({ where });

		if (!user) {
			throw new ForbiddenException('Użytkownik nie istnieje, lub nie posiadasz do niego dostępu.');
		}

		if (!user.is_active || !user.password_hash) {
			throw new ForbiddenException('Konto nie zostało jeszcze aktywowane.');
		}

		const isPasswordValid = await argon2.verify(user.password_hash, password);

		if (!isPasswordValid) {
			throw new ForbiddenException('Niepoprawny email lub hasło.');
		}

		return user;
	}

	private canAccess(role: UserRole, userId: number, targetId: number) {
		if (role === 'CLIENT' && userId !== targetId) {
			throw new ForbiddenException('Brak uprawnień do wykonania operacji.');
		}
	}

	private async checkPassword(password: string) {
		const minLength = 8;
		const hasUpper = /[A-Z]/.test(password);
		const hasLower = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (password.length < minLength) {
			throw new BadRequestException('Hasło musi mieć co najmniej 8 znaków.');
		}
		if (!hasUpper) {
			throw new BadRequestException('Hasło musi zawierać przynajmniej jedną wielką literę.');
		}
		if (!hasLower) {
			throw new BadRequestException('Hasło musi zawierać przynajmniej jedną małą literę.');
		}
		if (!hasNumber) {
			throw new BadRequestException('Hasło musi zawierać przynajmniej jedną cyfrę.');
		}
		if (!hasSpecial) {
			throw new BadRequestException('Hasło musi zawierać przynajmniej jeden znak specjalny.');
		}

		return await argon2.hash(password);
	}

	private async createUserCode() {
		const year = new Date().getFullYear().toString();
		const count = await this.prisma.user.count();
		const nextNumber = (count + 1).toString();

		const fixedPart = `USER${year}${nextNumber}`;

		const remaining = Math.max(16 - fixedPart.length, 0);

		let randomFill = '';

		for (let i = 0; i < remaining; i++) {
			randomFill += crypto.randomInt(0, 10).toString();
		}

		return `${fixedPart}${randomFill}`.slice(0, 16);
	}
}

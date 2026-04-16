import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from '@/common/exceptions/prisma.exception';
import { PostResetTokenDto } from './dto/post.dto';

@Injectable()
export class ResetTokenService {
	constructor(private readonly prisma: PrismaService) {}

	async findUnique(id: number) {
		try {
			const token = await this.prisma.resetToken.findUnique({
				where: {
					user_id: id,
				},
			});

			if (!token) {
				throw new NotFoundException('Nie znaleziono tokena u danego użytkownika.');
			}

			if (token.expire_at < new Date()) {
				throw new NotFoundException('token już wygasł.');
			}

			return token;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async create(dto: PostResetTokenDto) {
		try {
			const { user_id, ...data } = dto;

			return await this.prisma.resetToken.upsert({
				where: { user_id },
				update: { ...data },
				create: { ...dto },
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async delete(id: number) {
		try {
			return await this.prisma.session.delete({
				where: {
					user_id: id,
				},
			});
		} catch (error) {
			handlePrismaError(error);
		}
	}
}

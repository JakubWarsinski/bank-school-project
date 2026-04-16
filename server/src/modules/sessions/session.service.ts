import { PostSessionDto } from './dto/post.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { handlePrismaError } from '@/common/exceptions/prisma.exception';

@Injectable()
export class SessionService {
	constructor(private readonly prisma: PrismaService) {}

	async findUnique(id: number) {
		try {
			const session = await this.prisma.session.findUnique({
				where: {
					user_id: id,
				},
			});

			if (!session) {
				throw new NotFoundException('Nie znaleziono wymaganej sesji.');
			}

			return session;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async create(dto: PostSessionDto) {
		try {
			const { user_id, ...data } = dto;

			return await this.prisma.session.upsert({
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

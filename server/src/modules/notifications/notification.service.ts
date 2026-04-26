import { GetNotificationDto } from './dto/get.dto';
import { PostNotificationDto } from './dto/post.dto';
import { UserService } from '../users/users.service';
import { JwtData } from '../auth/strategies/access.strategy';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { handlePrismaError } from '../../common/exceptions/prisma.exception';
import { buildWhere } from '../../common/helpers/build_where.helper';
import { buildPage } from '../../common/helpers/build_page.helper';

@Injectable()
export class NotificationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
	) {}

	async findUnique(where: Prisma.NotificationWhereUniqueInput, jwt?: JwtData) {
		try {
			if (jwt && jwt.role == 'CLIENT') {
				where.user_id = jwt.id;
			}

			const notification = await this.prisma.notification.findUnique({ where });

			if (!notification) {
				throw new ForbiddenException('Powiadomienie nie istnieje, lub nie posiadasz do niego dostępu.');
			}

			return notification;
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async findMany(dto: GetNotificationDto, jwt?: JwtData) {
		try {
			const { cursor, limit, ...filters } = dto;

			const where: Prisma.NotificationWhereInput = buildWhere(filters, ['type']);

			if (jwt && jwt.role == 'CLIENT') {
				where.user_id = jwt.id;
			}

			const notifications = await this.prisma.notification.findMany({
				where,
				take: limit + 1,
				cursor: cursor ? { notification_id: cursor } : undefined,
				orderBy: {
					notification_id: 'asc',
				},
			});

			return buildPage(notifications, limit, 'notification_id');
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async create(dto: PostNotificationDto) {
		try {
			await this.userService.findUnique({ user_id: dto.user_id });

			return await this.prisma.notification.create({ data: dto });
		} catch (error) {
			handlePrismaError(error);
		}
	}

	async delete(id: number, jwt?: JwtData) {
		try {
			const where: Prisma.NotificationWhereUniqueInput = { notification_id: id };

			if (jwt && jwt.role == 'CLIENT') {
				where.user_id = jwt.id;
			}

			return await this.prisma.notification.delete({ where });
		} catch (error) {
			handlePrismaError(error);
		}
	}
}

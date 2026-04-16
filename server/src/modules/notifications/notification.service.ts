import { GetNotificationDto } from './dto/get.dto';
import { PostNotificationDto } from './dto/post.dto';
import { UserService } from '../users/users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtData } from '../auth/strategies/access.strategy';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { buildWhere } from '@/common/helpers/build_where.helper';
import { handlePrismaError } from '@/common/exceptions/prisma.exception';
import { NotificationWhereInput, NotificationWhereUniqueInput } from '@db/generated/prisma/models';

@Injectable()
export class NotificationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
	) {}

	async findUnique(where: NotificationWhereUniqueInput, jwt?: JwtData) {
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

			const where: NotificationWhereInput = buildWhere(filters, ['type']);

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

			if (notifications.length > limit) {
				return {
					notifications: notifications.slice(0, limit),
					cursor: notifications[limit].user_id,
				};
			}

			return {
				notifications: notifications,
				cursor: null,
			};
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
			const where: NotificationWhereUniqueInput = { notification_id: id };

			if (jwt && jwt.role == 'CLIENT') {
				where.user_id = jwt.id;
			}

			return await this.prisma.notification.delete({ where });
		} catch (error) {
			handlePrismaError(error);
		}
	}
}

import { Jwt } from '../../common/decorators/jwt.decorator';
import { Roles } from '../../common/decorators/role.decorator';
import { JwtData } from '../auth/strategies/access.strategy';
import { GetNotificationDto } from './dto/get.dto';
import { PostNotificationDto } from './dto/post.dto';
import { NotificationService } from './notification.service';
import { Controller, Param, Get, Query, Post, Body, Delete } from '@nestjs/common';

@Controller('notifications')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Get(':id')
	async findUnique(@Param('id') id: number, @Jwt() user: JwtData) {
		return await this.notificationService.findUnique({ notification_id: id }, user);
	}

	@Get()
	async findMany(@Query() dto: GetNotificationDto, @Jwt() user: JwtData) {
		return await this.notificationService.findMany(dto, user);
	}

	@Roles('ADMIN', 'EMPLOYEE')
	@Post()
	async create(@Body() dto: PostNotificationDto) {
		return await this.notificationService.create(dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: number, @Jwt() user: JwtData) {
		return await this.notificationService.delete(id, user);
	}
}

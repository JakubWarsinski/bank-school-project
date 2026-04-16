import { NotificationDto } from './main.dto';
import { PickType } from '@nestjs/mapped-types';

export class PostNotificationDto extends PickType(NotificationDto, ['user_id', 'type', 'title', 'message'] as const) {}

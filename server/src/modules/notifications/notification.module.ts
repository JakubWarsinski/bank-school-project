import { Module } from '@nestjs/common';
import { UserModule } from '../users/users.module';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
	imports: [UserModule],
	providers: [NotificationService],
	controllers: [NotificationController],
	exports: [NotificationService],
})
export class NotificationModule {}

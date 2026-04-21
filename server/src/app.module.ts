import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';
import { SessionModule } from './modules/sessions/session.module';
import { AccountModule } from './modules/accounts/account.module';
import { CardModule } from './modules/cards/card.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { TransactionModule } from './modules/transactions/transactions.module';

@Module({
	imports: [
		UserModule,
		AuthModule,
		SessionModule,
		PrismaModule,
		AccountModule,
		CardModule,
		NotificationModule,
		TransactionModule,
	],
})
export class AppModule {}

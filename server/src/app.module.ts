import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';
import { AccountModule } from './modules/accounts/account.module';
import { SessionModule } from './modules/sessions/session.module';
import { CardModule } from './modules/cards/card.module';
import { TransactionModule } from './modules/transactions/transactions.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { ResetTokenModule } from './modules/reset_token/reset_token.module';

@Module({
	imports: [
		UserModule,
		AccountModule,
		AuthModule,
		SessionModule,
		CardModule,
		TransactionModule,
		NotificationModule,
		PrismaModule,
		ResetTokenModule,
	],
})
export class AppModule {}

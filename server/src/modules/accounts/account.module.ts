import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { UserModule } from '../users/users.module';
import { AccountController } from './account.controller';

@Module({
	imports: [UserModule],
	providers: [AccountService],
	controllers: [AccountController],
	exports: [AccountService],
})
export class AccountModule {}

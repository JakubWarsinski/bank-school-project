import { Module } from '@nestjs/common';
import { AccountModule } from '../accounts/account.module';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';

@Module({
	imports: [AccountModule],
	controllers: [TransactionController],
	providers: [TransactionService],
})
export class TransactionModule {}

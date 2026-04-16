import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { AccountModule } from '../accounts/account.module';

@Module({
	imports: [AccountModule],
	providers: [CardService],
	controllers: [CardController],
})
export class CardModule {}

import { CardDto } from './main.dto';
import { PickType } from '@nestjs/mapped-types';

export class PostCardDto extends PickType(CardDto, ['account_id', 'payment_limit', 'withdraw_limit'] as const) {}

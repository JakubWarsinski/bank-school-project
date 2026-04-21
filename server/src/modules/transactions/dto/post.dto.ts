import { TransactionDto } from './main.dto';
import { PickType } from '@nestjs/mapped-types';
import { Length, IsString } from 'class-validator';

export class PostTransactionDto extends PickType(TransactionDto, [
	'type',
	'title',
	'description',
	'amount',
	'currency',
] as const) {
	@Length(28, 28, { message: 'Numer rachunku nadawca musi mieć dokładnie 28 znaków.' })
	@IsString({ message: 'Numer rachunku odbiorcy musi być tekstem.' })
	readonly sender_iban!: string;

	@Length(28, 28, { message: 'Numer rachunku odbiorcy musi mieć dokładnie 28 znaków.' })
	@IsString({ message: 'Numer rachunku odbiorcy musi być tekstem.' })
	readonly receiver_iban!: string;
}

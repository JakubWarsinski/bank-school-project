import { Type } from 'class-transformer';
import { TransactionDto } from './main.dto';
import { IsInt, Min, IsOptional } from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class GetTransactionDto extends PartialType(
	PickType(TransactionDto, [
		'code',
		'status',
		'type',
		'amount',
		'currency',
		'booking_date',
		'created_at',
		'updated_at',
	] as const),
) {
	@Min(1, { message: 'Kursor musi być większa niż 0.' })
	@Type(() => Number)
	@IsInt({ message: 'Kursor musi być liczbą całkowitą.' })
	@IsOptional()
	cursor?: number;

	@Min(1, { message: 'Wartość ograniczenia musi być większa niż 0.' })
	@Type(() => Number)
	@IsInt({ message: 'Wartość ograniczenia musi być liczbą całkowitą.' })
	@IsOptional()
	limit: number = 5;
}

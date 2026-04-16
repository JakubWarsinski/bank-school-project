import { CardDto } from './main.dto';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class GetCardDto extends PartialType(
	PickType(CardDto, [
		'status',
		'expiry_month',
		'expiry_year',
		'payment_limit',
		'withdraw_limit',
		'blocked_at',
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

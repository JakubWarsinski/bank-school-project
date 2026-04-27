import { Type } from 'class-transformer';
import { TransactionDto } from './main.dto';
import { IsInt, Min, IsOptional, IsDate, IsNumber } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class GetTransactionDto extends PartialType(
	OmitType(TransactionDto, ['transaction_id', 'sender_id', 'receiver_id', 'description'] as const),
) {
	@Min(1, { message: 'Kursor musi być większa niż 0.' })
	@Type(() => Number)
	@IsInt({ message: 'Kursor musi być liczbą całkowitą.' })
	@IsOptional()
	readonly cursor?: number;

	@Min(1, { message: 'Wartość ograniczenia musi być większa niż 0.' })
	@Type(() => Number)
	@IsInt({ message: 'Wartość ograniczenia musi być liczbą całkowitą.' })
	@IsOptional()
	readonly limit: number = 5;

	@Min(0, { message: 'Kwota nie może być liczbą ujemną' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Kwota musi być liczbą.' })
	@IsOptional()
	readonly amount_gte?: number;

	@Min(0, { message: 'Kwota nie może być liczbą ujemną' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Kwota musi być liczbą.' })
	@IsOptional()
	readonly amount_lte?: number;

	@Type(() => Date)
	@IsDate({ message: 'Data księgowania musi być poprawną datą.' })
	@IsOptional()
	readonly booking_date_gte?: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data księgowania musi być poprawną datą.' })
	@IsOptional()
	readonly booking_date_lte?: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data utworzenia konta musi być poprawną datą.' })
	@IsOptional()
	readonly created_at_gte?: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data utworzenia konta musi być poprawną datą.' })
	@IsOptional()
	readonly created_at_lte?: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data ostatniej aktualizacji konta musi być poprawną datą.' })
	@IsOptional()
	readonly updated_at_gte?: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data ostatniej aktualizacji konta musi być poprawną datą.' })
	@IsOptional()
	readonly updated_at_lte?: Date;
}

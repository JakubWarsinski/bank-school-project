import { CardDto } from './main.dto';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsDate, IsNumber } from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class GetCardDto extends PartialType(
	PickType(CardDto, ['status', 'expiry_month', 'expiry_year', 'blocked_at', 'created_at', 'updated_at'] as const),
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

	@Min(0, { message: 'Miesiąc wygaśnięcia karty nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Miesiąc wygaśnięcia karty musi być liczbą.' })
	@IsOptional()
	readonly expiry_month_gte?: number;

	@Min(0, { message: 'Miesiąc wygaśnięcia karty nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Miesiąc wygaśnięcia karty musi być liczbą.' })
	@IsOptional()
	readonly expiry_month_lte?: number;

	@Min(0, { message: 'Rok wygaśnięcia karty nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Rok wygaśnięcia karty musi być liczbą.' })
	@IsOptional()
	readonly expiry_year_gte?: number;

	@Min(0, { message: 'Rok wygaśnięcia karty nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Rok wygaśnięcia karty musi być liczbą.' })
	@IsOptional()
	readonly expiry_year_lte?: number;

	@Type(() => Date)
	@IsDate({ message: 'Data blokady musi być poprawną datą.' })
	@IsOptional()
	readonly blocked_at_gte?: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data blokady musi być poprawną datą.' })
	@IsOptional()
	readonly blocked_at_lte?: Date;

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

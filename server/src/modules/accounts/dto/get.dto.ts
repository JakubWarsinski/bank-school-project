import { AccountDto } from './main.dto';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsDate, IsNumber } from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class GetAccountDto extends PartialType(
	PickType(AccountDto, ['iban', 'status', 'current_balance', 'closed_at', 'created_at', 'updated_at'] as const),
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

	@Type(() => Date)
	@IsDate({ message: 'Data zamknięcia konta musi być poprawną datą.' })
	@IsOptional()
	readonly closed_at_gte?: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data zamknięcia konta musi być poprawną datą.' })
	@IsOptional()
	readonly closed_at_lte?: Date;

	@Min(0, { message: 'Aktualne saldo nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Aktualne saldo musi być liczbą.' })
	@IsOptional()
	readonly current_balance_gte?: Number;

	@Min(0, { message: 'Aktualne saldo nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Aktualne saldo musi być liczbą.' })
	@IsOptional()
	readonly current_balance_lte?: Number;
}

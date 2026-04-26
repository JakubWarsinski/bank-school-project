import { Type } from 'class-transformer';
import { AccountStatus } from '@prisma/client';
import { IsString, Length, IsNumber, Min, IsDate, IsEnum } from 'class-validator';

export class AccountDto {
	@Min(0, { message: 'ID konta nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID konta musi być liczbą.' })
	readonly account_id!: number;

	@Length(28, 28, { message: 'Kod IBAN musi mieć dokładnie 28 znaków.' })
	@IsString({ message: 'Kod IBAN musi być tekstem.' })
	readonly iban!: string;

	@Length(3, 3, { message: 'Kod waluty musi mieć dokładnie 3 znaki.' })
	@IsString({ message: 'Kod waluty musi być tekstem.' })
	readonly currency!: string;

	@Length(1, 50, { message: 'Nazwa konta może mieć maksymalnie 50 znaków.' })
	@IsString({ message: 'Nazwa konta musi być tekstem.' })
	readonly name!: string;

	@IsEnum(AccountStatus, { message: 'Status musi być jedną z dozwolonych wartości.' })
	readonly status!: AccountStatus;

	@Min(0, { message: 'Aktualne saldo nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Aktualne saldo musi być liczbą.' })
	readonly current_balance!: number;

	@Min(0, { message: 'Dostępne saldo nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Dostępne saldo musi być liczbą.' })
	readonly available_balance!: number;

	@Min(0, { message: 'Kwota zablokowana nie może być mniejsza niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Kwota zablokowana musi być liczbą.' })
	readonly blocked_amount!: number;

	@Min(0, { message: 'Dniowy limit nie może być mniejszy niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Dniowy limit musi być liczbą.' })
	readonly daily_transfer_limit!: number;

	@Type(() => Date)
	@IsDate({ message: 'Data zamknięcia konta musi być poprawną datą.' })
	readonly closed_at!: Date;

	@Length(1, 150, { message: 'Powód zamknięcia konta może mieć od 1 do 150 znaków.' })
	@IsString({ message: 'Powód zamknięcia konta musi być tekstem.' })
	readonly closed_reason!: string;

	@Type(() => Date)
	@IsDate({ message: 'Data utworzenia konta musi być poprawną datą.' })
	readonly created_at!: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data ostatniej aktualizacji konta musi być poprawną datą.' })
	readonly updated_at!: Date;
}

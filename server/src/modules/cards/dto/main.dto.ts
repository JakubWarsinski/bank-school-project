import { Type } from 'class-transformer';
import { CardStatus } from '@db/generated/prisma/enums';
import { IsString, IsNumber, IsDate, Length, Min, IsEnum } from 'class-validator';

export class CardDto {
	@Min(0, { message: 'ID karty nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID karty musi być liczbą.' })
	readonly card_id: number;

	@Min(0, { message: 'ID konta nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID konta musi być liczbą.' })
	readonly account_id: number;

	@Length(5, 50, { message: 'Nazwa karty musi mięć od 5 do 50 znaków.' })
	@IsString({ message: 'Nazwa karty musi być tekstem.' })
	readonly name: string;

	@IsEnum(CardStatus, { message: 'Status musi być jedną z dozwolonych wartości.' })
	readonly status: CardStatus;

	@IsString({ message: 'Numer karty musi być tekstem.' })
	readonly card_number: string;

	@Length(4, 4, { message: 'Ostatnie cyfry karty muszą mieć dokładnie 4 znaki.' })
	@IsString({ message: 'Ostatnie cyfry karty muszą być tekstem.' })
	readonly last_digits: string;

	@IsString({ message: 'Kod CVV musi być tekstem.' })
	readonly cvv: string;

	@IsString({ message: 'PIN musi być tekstem.' })
	readonly pin: string;

	@Min(0, { message: 'Miesiąc wygaśnięcia karty nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Miesiąc wygaśnięcia karty musi być liczbą.' })
	readonly expiry_month: number;

	@Min(0, { message: 'Rok wygaśnięcia karty nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Rok wygaśnięcia karty musi być liczbą.' })
	readonly expiry_year: number;

	@Min(0, { message: 'Limit płatności nie może być mniejszy niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Limit płatności musi być liczbą.' })
	readonly payment_limit: number;

	@Min(0, { message: 'Limit wypłaty nie może być mniejszy niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Limit wypłaty musi być liczbą.' })
	readonly withdraw_limit: number;

	@Min(0, { message: 'Dzienny limit wypłat nie może być mniejszy niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Dzienny limit wypłat musi być liczbą.' })
	readonly daily_withdraw_limit: number;

	@Min(0, { message: 'Dzienny limit płatności nie może być mniejszy niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Dzienny limit płatności musi być liczbą.' })
	readonly daily_payment_limit: number;

	@Type(() => Date)
	@IsDate({ message: 'Data blokady musi być poprawną datą.' })
	readonly blocked_at: Date;

	@Length(1, 150, { message: 'Powód blokady może mieć od 1 do 150 znaków.' })
	@IsString({ message: 'Powód blokady musi być tekstem.' })
	readonly blocked_reason: string;

	@Type(() => Date)
	@IsDate({ message: 'Data utworzenia musi być poprawną datą.' })
	readonly created_at: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data aktualizacji musi być poprawną datą.' })
	readonly updated_at: Date;
}

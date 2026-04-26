import { Type } from 'class-transformer';
import { IsString, Length, IsEnum, IsDate, IsNumber, Min } from 'class-validator';
import { StatusType, TransactionType } from '@prisma/client';

export class TransactionDto {
	@Min(0, { message: 'ID transakcji nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID transakcji musi być liczbą.' })
	readonly transaction_id!: number;

	@Length(30, 30, { message: 'Kod transakcji musi mieć dokładnie 30 znaków.' })
	@IsString({ message: 'Kod transakcji musi być tekstem.' })
	readonly code!: string;

	@IsEnum(StatusType, { message: 'Status musi być jedną z dozwolonych wartości.' })
	readonly status!: StatusType;

	@IsEnum(TransactionType, { message: 'Typ transakcji musi być jedną z dozwolonych wartości.' })
	readonly type!: TransactionType;

	@Min(0, { message: 'ID nadawcy nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID nadawcy musi być liczbą.' })
	readonly sender_id!: number;

	@Min(0, { message: 'ID odbiorcy nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID odbiorcy musi być liczbą.' })
	readonly receiver_id!: number;

	@Length(1, 80, { message: 'Tytuł transakcji musi mieć od 1 do 80 znaków.' })
	@IsString({ message: 'Tytuł transakcji musi być tekstem.' })
	readonly title!: string;

	@Length(1, 200, { message: 'Opis transakcji może mieć od 1 do 200 znaki.' })
	@IsString({ message: 'Opis transakcji musi być tekstem.' })
	readonly description!: string;

	@Min(0, { message: 'Kwota nie może być liczbą ujemną' })
	@Type(() => Number)
	@IsNumber({}, { message: 'Kwota musi być liczbą.' })
	readonly amount!: number;

	@Length(3, 3, { message: 'Kod waluty musi mieć dokładnie 3 znaki.' })
	@IsString({ message: 'Kod waluty musi być tekstem.' })
	readonly currency!: string;

	@Type(() => Date)
	@IsDate({ message: 'Data księgowania musi być poprawną datą.' })
	readonly booking_date!: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data utworzenia musi być poprawną datą.' })
	readonly created_at!: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data aktualizacji musi być poprawną datą.' })
	readonly updated_at!: Date;
}

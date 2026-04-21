import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString, Min } from 'class-validator';

export class PostSessionDto {
	@Min(0, { message: 'ID użytkownika nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
	readonly user_id!: number;

	@IsString({ message: 'token musi być tekstem.' })
	readonly token_hash!: string;

	@Type(() => Date)
	@IsDate({ message: 'Data wygaśnięcia musi być poprawną datą.' })
	readonly expire_at!: Date;
}

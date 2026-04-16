import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PostSessionDto {
	@Min(0, { message: 'ID użytkownika nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
	readonly user_id: number;

	@IsString({ message: 'token musi być tekstem.' })
	readonly token_hash: string;

	@IsString({ message: 'Adres IP musi być tekstem.' })
	@IsOptional()
	readonly ip_address?: string;

	@IsString({ message: 'Agent musi być tekstem.' })
	readonly user_agent: string;

	@IsString({ message: 'Typ użądzenia musi być tekstem.' })
	@IsOptional()
	readonly device?: string;

	@Type(() => Date)
	@IsDate({ message: 'Data wygaśnięcia musi być poprawną datą.' })
	readonly expires_at: Date;
}

import { UserDto } from './main.dto';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsDate } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

export class GetUserDto extends PartialType(
	OmitType(UserDto, [
		'user_id',
		'password',
		'profession',
		'id_card_issue',
		'id_card_expiry',
		'monthly_net_income',
		'main_income_sources',
	] as const),
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
}

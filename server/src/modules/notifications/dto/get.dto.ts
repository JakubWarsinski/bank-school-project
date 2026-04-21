import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsDate } from 'class-validator';
import { PartialType, PickType } from '@nestjs/mapped-types';
import { NotificationDto } from './main.dto';

export class GetNotificationDto extends PartialType(PickType(NotificationDto, ['type', 'created_at'] as const)) {
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
}

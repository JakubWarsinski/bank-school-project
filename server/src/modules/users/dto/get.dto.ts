import { UserDto } from './main.dto';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';

export class GetUserDto extends PartialType(OmitType(UserDto, ['code', 'pesel', 'email'] as const)) {
	@Min(1, { message: 'Kursor musi być większa niż 0.' })
	@Type(() => Number)
	@IsInt({ message: 'Kursor musi być liczbą całkowitą.' })
	@IsOptional()
	cursor?: number;

	@Min(1, { message: 'Wartość ograniczenia musi być większa niż 0.' })
	@Type(() => Number)
	@IsInt({ message: 'Wartość ograniczenia musi być liczbą całkowitą.' })
	@IsOptional()
	limit: number = 5;
}

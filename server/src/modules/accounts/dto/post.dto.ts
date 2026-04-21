import { AccountDto } from './main.dto';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/mapped-types';
import { IsNumber, Min } from 'class-validator';

export class PostAccountDto extends PickType(AccountDto, ['currency'] as const) {
	@Min(0, { message: 'ID użytkownika nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
	readonly user_id!: number;
}

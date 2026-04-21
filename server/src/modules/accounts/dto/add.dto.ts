import { Type } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { AccountRole } from '../../../../prisma/generated/prisma/enums';

export class AddAccountDto {
	@Min(0, { message: 'ID użytkownika nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
	readonly user_id!: number;

	@IsEnum(AccountRole, { message: 'Typ konta musi być jednym z dozwolonych wartości.' })
	readonly role!: AccountRole;
}

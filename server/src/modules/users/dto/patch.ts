import { UserRole } from '../../../../prisma/generated/prisma/enums';
import { UserDto } from './main.dto';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class PatchUserDto extends PartialType(
	OmitType(UserDto, ['user_id', 'code', 'updated_at', 'created_at'] as const),
) {}

export const PatchUserDtoPolicy: Record<UserRole, (keyof PatchUserDto)[]> = {
	CLIENT: [
		'role',
		'first_name',
		'last_name',
		'date_of_birth',
		'pesel',
		'is_active',
		'id_card_number',
		'id_card_issue',
		'id_card_expiry',
	],
	ADMIN: ['password'],
	EMPLOYEE: ['role', 'password'],
};

import { UserRole } from '@db/generated/prisma/enums';
import { UserDto } from './main.dto';
import { OmitType } from '@nestjs/mapped-types';

export class PostUserDto extends OmitType(UserDto, [
	'user_id',
	'code',
	'password',
	'is_active',
	'updated_at',
	'created_at',
] as const) {}

export const PostUserDtoPolicy: Record<UserRole, (keyof PostUserDto)[]> = {
	CLIENT: [],
	ADMIN: [],
	EMPLOYEE: ['role'],
};

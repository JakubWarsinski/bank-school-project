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

class AdminDto extends PostUserDto {}

class EmployeeDto extends OmitType(PostUserDto, ['role'] as const) {}

export const PostUserDtoPolicy = {
	ADMIN: AdminDto,
	EMPLOYEE: EmployeeDto,
};

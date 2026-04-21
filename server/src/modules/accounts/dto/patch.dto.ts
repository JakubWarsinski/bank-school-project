import { UserRole } from '@db/generated/prisma/enums';
import { AccountDto } from './main.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class PatchAccountDto extends PartialType(
	PickType(AccountDto, ['currency', 'name', 'status', 'daily_transfer_limit', 'closed_at', 'closed_reason'] as const),
) {}

export const PatchAccountDtoPolicy: Record<UserRole, (keyof PatchAccountDto)[]> = {
	CLIENT: ['status', 'daily_transfer_limit', 'closed_at', 'closed_reason'],
	ADMIN: ['name'],
	EMPLOYEE: ['name'],
};

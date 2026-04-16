import { AccountDto } from './main.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class PatchAccountDto extends PartialType(
	PickType(AccountDto, [
		'currency',
		'status',
		'name',
		'current_balance',
		'available_balance',
		'blocked_amount',
		'daily_transfer_limit',
		'closed_at',
		'closed_reason',
	] as const),
) {}

export const PatchAccountRolesDto = {
	ADMIN: [
		'currency',
		'status',
		'current_balance',
		'available_balance',
		'blocked_amount',
		'daily_transfer_limit',
		'closed_at',
		'closed_reason',
	],
	EMPLOYEE: ['currency', 'status', 'closed_at', 'closed_reason'],
	CLIENT: ['currency', 'name'],
};

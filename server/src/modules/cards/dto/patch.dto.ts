import { CardDto } from './main.dto';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class PatchCardDto extends PartialType(
	PickType(CardDto, [
		'name',
		'status',
		'pin',
		'daily_withdraw_limit',
		'daily_payment_limit',
		'blocked_at',
		'blocked_reason',
	] as const),
) {}

export const PatchCardRolesDto = {
	ADMIN: ['status', 'pin', 'payment_limit', 'withdraw_limit', 'blocked_at', 'blocked_reason'],
	EMPLOYEE: ['status', 'pin', 'payment_limit', 'withdraw_limit', 'blocked_at', 'blocked_reason'],
	CLIENT: ['name', 'pin', 'daily_withdraw_limit', 'daily_payment_limit'],
};

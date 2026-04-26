import { UserRole } from '@prisma/client';
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

export const PatchCardDtoPolicy: Record<UserRole, (keyof PatchCardDto)[]> = {
	CLIENT: ['status', 'blocked_at', 'blocked_reason'],
	ADMIN: ['name'],
	EMPLOYEE: ['name'],
};

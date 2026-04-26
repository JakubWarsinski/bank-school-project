import { BadRequestException } from '@nestjs/common';

export function filterDtoByRole<T extends object>(body: T, policy: (keyof T)[]): Partial<T> {
	const result: Partial<T> = {};
	const violations: string[] = [];

	for (const [key, value] of Object.entries(body) as [keyof T, any][]) {
		if (policy.includes(key)) {
			violations.push(String(key));
			continue;
		}

		result[key] = value;
	}

	if (violations.length > 0) {
		throw new BadRequestException({
			message: `Niedozwolone pole(a) w DTO: ${violations.join(', ')}`,
			fields: violations,
			reason: 'FIELD_NOT_ALLOWED_BY_POLICY',
		});
	}

	return result;
}

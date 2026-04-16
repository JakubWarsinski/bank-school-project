import { ForbiddenException } from '@nestjs/common';

export function filterDtoByRole<T extends object>(dto: T, allowed: Record<string, readonly string[]>, role: string) {
	const allowedFields = allowed[role];
	const forbiddenFields: string[] = [];

	const result = {} as T;

	for (const key in dto) {
		if (dto[key] === undefined) continue;

		if (!allowedFields.includes(key)) {
			forbiddenFields.push(key);
			continue;
		}

		result[key] = dto[key];
	}

	if (forbiddenFields.length > 0) {
		throw new ForbiddenException(`Brak uprawnień do modyfikacji pól: ${forbiddenFields.join(', ')}`);
	}

	return result;
}

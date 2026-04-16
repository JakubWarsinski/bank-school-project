import { equal } from 'assert';

export function buildWhere(dto: Record<string, any>, skipKeys: string[] = []) {
	const where = {};
	const skipSet = new Set(skipKeys);

	for (const [key, value] of Object.entries(dto)) {
		if (skipSet.has(key)) {
			where[key] = { equals: value };
			continue;
		}

		if (value === undefined || value === null) continue;

		if (value instanceof Date && !isNaN(value.getTime())) {
			where[key] = { gte: value };
			continue;
		}

		if (typeof value === 'number' && !isNaN(value)) {
			where[key] = { gte: value };
			continue;
		}

		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) continue;

			where[key] = { contains: trimmed, mode: 'insensitive' };
			continue;
		}

		where[key] = value;
	}

	return where;
}

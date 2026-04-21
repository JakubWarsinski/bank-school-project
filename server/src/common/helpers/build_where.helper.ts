export function buildWhere(dto: Record<string, any>, rawFields: string[] = []) {
	const where: Record<string, any> = {};

	const operators = ['gt', 'gte', 'lt', 'lte'];
	const rawSet = new Set(rawFields);

	for (const [key, value] of Object.entries(dto)) {
		if (value === undefined || value === null) continue;

		if (rawSet.has(key)) {
			where[key] = value;
			continue;
		}

		let matched = false;

		for (const op of operators) {
			const suffix = `_${op}`;

			if (key.endsWith(suffix)) {
				const field = key.slice(0, -suffix.length);

				where[field] ??= {};
				where[field][op] = value;

				matched = true;
				break;
			}
		}

		if (matched) continue;

		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) continue;

			where[key] = { contains: trimmed };
			continue;
		}

		where[key] = value;
	}

	return where;
}

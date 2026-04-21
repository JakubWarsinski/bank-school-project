export function filterDtoByRole<T extends object>(body: T, policy: (keyof T)[]): Partial<T> {
	const result: Partial<T> = {};

	for (const [key, value] of Object.entries(body)) {
		if (policy.includes(key as keyof T)) {
			continue;
		}

		result[key as keyof T] = value;
	}

	return result;
}

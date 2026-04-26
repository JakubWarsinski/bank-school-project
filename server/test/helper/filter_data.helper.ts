export function omit<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
	const copy = { ...obj };

	for (const key of keys) {
		delete copy[key];
	}

	return copy;
}

export function pick<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
	const result = {} as Partial<T>;

	for (const key of keys) {
		result[key] = obj[key];
	}

	return result;
}

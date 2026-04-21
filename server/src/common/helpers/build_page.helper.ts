export type Page<T, K extends keyof T> = {
	items: T[];
	cursor: T[K] | null;
};

export function buildPage<T, K extends keyof T>(items: T[], limit: number, cursorKey: K): Page<T, K> {
	if (items.length > limit) {
		return {
			items: items.slice(0, limit),
			cursor: items[limit][cursorKey],
		};
	}

	return {
		items,
		cursor: null,
	};
}

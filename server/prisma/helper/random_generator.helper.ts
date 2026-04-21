export const pickRandom = <T>(items: T[]): T => {
	const index = Math.floor(Math.random() * items.length);

	return items[index];
};

export const generateRandomDigits = (length: number): string => {
	return Array.from({ length })
		.map(() => Math.floor(Math.random() * 10))
		.join('');
};

export const generateRandomDate = (start: Date, end: Date): string => {
	const startTime = start.getTime();
	const endTime = end.getTime();

	const randomTime = startTime + Math.random() * (endTime - startTime);

	const date = new Date(randomTime);

	return date.toISOString().split('T')[0];
};

export const generateRandomInt = (min: number, max: number): number => {
	const range = max - min + 1;
	const randomOffset = Math.floor(Math.random() * range);

	return min + randomOffset;
};

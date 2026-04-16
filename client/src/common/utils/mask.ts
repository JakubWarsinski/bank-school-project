export const maskText = (value: string, revealed: boolean): string => {
	if (revealed) return value;
	if (!value) return '';

	return `*****`;
};

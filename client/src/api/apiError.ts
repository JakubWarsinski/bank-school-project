import { AxiosError } from 'axios';

export const apiError = (error: unknown): never => {
	if (error instanceof AxiosError) {
		throw new Error(error.response?.data?.message ?? error.response?.statusText ?? 'Błąd serwera');
	}

	if (error instanceof Error) {
		throw new Error(error.message);
	}

	throw new Error('Nieznany błąd');
};

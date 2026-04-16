import { api } from './api';
import { apiError } from '@/api/apiError';
import { AuthResponse, PostAuthDto } from '@/types/auth';

const BASE_URL = '/auth';

export const authApi = {
	login: async (dto: PostAuthDto): Promise<AuthResponse> => {
		try {
			const { data } = await api.post(`${BASE_URL}/login`, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	refresh: async (): Promise<AuthResponse> => {
		try {
			const { data } = await api.get(BASE_URL);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	logout: async (): Promise<void> => {
		try {
			await api.delete(BASE_URL);
		} catch (error) {
			return apiError(error);
		}
	},
};

import { api } from './api';
import { apiError } from '@/api/apiError';
import { Account, GetAccountDto, GetAccountResponse, PatchAccountDto, PostAccountDto } from '@/types/account';

const BASE_URL = '/accounts';

export const cardApi = {
	getUnique: async (id: number): Promise<Account> => {
		try {
			const { data } = await api.get(`${BASE_URL}/${id}`);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	getMany: async (dto: GetAccountDto): Promise<GetAccountResponse> => {
		try {
			const { data } = await api.get(BASE_URL, { params: dto });
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	create: async (dto: PostAccountDto): Promise<Account> => {
		try {
			const { data } = await api.post(BASE_URL, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	patch: async (id: number, dto: PatchAccountDto): Promise<Account> => {
		try {
			const { data } = await api.patch(`${BASE_URL}/${id}`, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},
};

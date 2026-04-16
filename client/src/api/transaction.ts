import { api } from './api';
import { apiError } from '@/api/apiError';
import { GetTransactionDto, GetTransactionResponse, PostTransactionDto, Transaction } from '@/types/transaction';

const BASE_URL = '/transactions';

export const cardApi = {
	getUnique: async (id: number): Promise<Transaction> => {
		try {
			const { data } = await api.get(`${BASE_URL}/${id}`);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	getMany: async (dto: GetTransactionDto): Promise<GetTransactionResponse> => {
		try {
			const { data } = await api.get(BASE_URL, { params: dto });
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	create: async (dto: PostTransactionDto): Promise<Transaction> => {
		try {
			const { data } = await api.post(BASE_URL, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},
};

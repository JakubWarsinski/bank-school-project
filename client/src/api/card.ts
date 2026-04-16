import { api } from './api';
import { apiError } from '@/api/apiError';
import { Card, GetCardDto, GetCardResponse, PatchCardDto, PostCardDto } from '@/types/card';

const BASE_URL = '/cards';

export const cardApi = {
	getUnique: async (id: number): Promise<Card> => {
		try {
			const { data } = await api.get(`${BASE_URL}/${id}`);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	getMany: async (dto: GetCardDto): Promise<GetCardResponse> => {
		try {
			const { data } = await api.get(BASE_URL, { params: dto });
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	create: async (dto: PostCardDto): Promise<Card> => {
		try {
			const { data } = await api.post(BASE_URL, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	patch: async (id: number, dto: PatchCardDto): Promise<Card> => {
		try {
			const { data } = await api.patch(`${BASE_URL}/${id}`, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},
};

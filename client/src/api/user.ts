import { api } from './api';
import { apiError } from '@/api/apiError';
import { GetUserDto, GetUserResponse, PatchUserDto, PostUserDto, User } from '@/types/user';

const BASE_URL = '/users';

export const userApi = {
	getUnique: async (id: number): Promise<User> => {
		try {
			const { data } = await api.get(`${BASE_URL}/${id}`);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	getMany: async (dto: GetUserDto): Promise<GetUserResponse> => {
		try {
			const { data } = await api.get(BASE_URL, { params: dto });
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	create: async (dto: PostUserDto): Promise<User> => {
		try {
			const { data } = await api.post(BASE_URL, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},

	patch: async (id: number, dto: PatchUserDto): Promise<User> => {
		try {
			const { data } = await api.patch(`${BASE_URL}/${id}`, dto);
			return data;
		} catch (error) {
			return apiError(error);
		}
	},
};

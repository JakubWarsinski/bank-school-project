import axios, { AxiosInstance } from 'axios';

const API_URL = 'http://localhost:3000';

let accessToken: string | null = localStorage.getItem('accessToken') ?? null;

export const api: AxiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

api.interceptors.request.use(function (config) {
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

api.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error) {
		const request = error.config;

		if (!error.response || error.response.status !== 401 || request._retry) {
			return Promise.reject(error);
		}

		request._retry = true;

		try {
			const { data } = await axios.get(`${API_URL}/auth/refresh`, {
				withCredentials: true,
			});

			localStorage.setItem('user', JSON.stringify(data.user));
			localStorage.setItem('accessToken', data.accessToken);

			accessToken = data.accessToken;

			return api(request);
		} catch (refreshError) {
			// window.location.href = '/login';
			return Promise.reject(refreshError);
		}
	},
);

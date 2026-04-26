export const auth = (api: any, token: string = '') => ({
	get: (url: string) => api().get(url).set('Authorization', `Bearer ${token}`),
	post: (url: string) => api().post(url).set('Authorization', `Bearer ${token}`),
	put: (url: string) => api().put(url).set('Authorization', `Bearer ${token}`),
	patch: (url: string) => api().patch(url).set('Authorization', `Bearer ${token}`),
	delete: (url: string) => api().delete(url).set('Authorization', `Bearer ${token}`),
});

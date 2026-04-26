import { auth } from '../utils/auth.util';

export function compareData<T extends Record<string, any>>(a: T, b: T, skip: (keyof T)[] = []) {
	for (const key of Object.keys(a) as (keyof T)[]) {
		if (skip.includes(key)) continue;

		let valA: any = a[key];
		let valB: any = b[key];

		if (valA instanceof Date) {
			valA = valA.toISOString();
		}

		if (valB instanceof Date) {
			valB = valB.toISOString();
		}

		expect(valA).toEqual(valB);
	}
}

export async function compareGetData<T extends Record<string, any>>(a: T, api: any, token: string, endpoint: string) {
	for (const key of Object.keys(a)) {
		const value = a[key];

		const res = await auth(api, token)
			.get(endpoint)
			.query({ [key]: value });

		expect(res.status).toBe(200);
		expect(res.body).toBeDefined();
	}
}

export async function compareGetIncorrectData<T extends Record<string, any>>(
	a: T,
	api: any,
	token: string,
	endpoint: string,
) {
	for (const key of Object.keys(a)) {
		const values = a[key];

		for (const value of values) {
			const res = await auth(api, token)
				.get(endpoint)
				.query({ [key]: value });

			if (res.status !== 400) {
				console.log({
					status: 'VALIDATION FAILED',
					endpoint,
					key,
					value,
					query: { [key]: value },
					responseStatus: res.status,
					responseBody: res.body,
				});
			}

			expect(res.status).toBe(400);
		}
	}
}

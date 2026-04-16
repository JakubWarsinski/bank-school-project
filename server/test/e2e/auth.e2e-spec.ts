import request from 'supertest';
import { auth } from '../utils/auth.util';
import { app, db, prisma } from '../setup/e2e.setup';
import { generateRefreshToken, generateTokens } from '../utils/jwt.util';
import { InvalidAuthData } from '../data/auth.data';
import { User } from '../../prisma/generated/prisma/browser';

describe('AuthController', () => {
	const api = () => request(app.getHttpServer());

	let user: User;
	let userToken: { accessToken: string; refreshToken: string };

	const password = 'TestPassword123!';

	beforeAll(async () => {
		await prisma.$executeRawUnsafe('BEGIN');

		user = await db.createUser('USER', password);

		userToken = generateTokens(user.user_id, 'USER', user.first_name, user.last_name);
	});

	afterAll(async () => {
		await prisma.$executeRawUnsafe('ROLLBACK');
	});

	describe('/auth/login (POST)', () => {
		let endpoint = '/auth/login';

		it('Użytkownik powinien móc się zalogować', async () => {
			const res = await api()
				.post(endpoint)
				.set('User-Agent', 'jest-tests')
				.send({ email: user.email, password });

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body.user).toBeDefined();

			for (const key in res.body.user) {
				expect(res.body.user[key]).toEqual(user[key]);
			}

			expect(res.body.accessToken).toBeDefined();

			const rawCookies = res.headers['set-cookie'];
			const cookies: string[] = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
			expect(cookies.some((c) => c.startsWith('refresh_token='))).toBe(true);

			userToken.accessToken = res.body.accessToken;
		});

		it('Powinno zwrócić błąd przy braku wymaganych danych', async () => {
			const res = await api().post(endpoint).set('User-Agent', 'jest-tests').send({});

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowych danych wejściowych', async () => {
			const invalidSets = InvalidAuthData;

			for (const field of Object.keys(invalidSets)) {
				const invalidValues = invalidSets[field];

				for (const value of invalidValues) {
					const dto = {
						email: user.email,
						password,
						[field]: value,
					};

					const res = await api().post(endpoint).set('User-Agent', 'jest-tests').send(dto);

					if (res.status !== 400) {
						throw new Error(JSON.stringify(res.body));
					}
				}
			}
		});

		it('Powinno zwrócić błąd w przypadku braku agenta', async () => {
			const res = await auth(api).post(endpoint);

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});
	});

	describe('/auth/refresh (GET)', () => {
		let endpoint = '/auth/refresh';

		it('Użytkownik powinien móc odświeżyć swój token', async () => {
			const res = await api()
				.get(endpoint)
				.set('User-Agent', 'jest-tests')
				.set('Cookie', [`refresh_token=${userToken.refreshToken}`]);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body.user).toBeDefined();

			for (const key in res.body.user) {
				expect(res.body.user[key]).toEqual(user[key]);
			}

			expect(res.body.accessToken).toBeDefined();

			const rawCookies = res.headers['set-cookie'];
			const cookies: string[] = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
			expect(cookies.some((c) => c.startsWith('refresh_token='))).toBe(true);

			userToken.accessToken = res.body.accessToken;
		});

		it('Powinno zwrócić błąd w przypadku braku agenta', async () => {
			const res = await auth(api).get(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await api().get(endpoint).set('User-Agent', 'jest-tests');

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await api()
				.get(endpoint)
				.set('User-Agent', 'jest-tests')
				.set('Cookie', [`refresh_token=invalid`]);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku kiedy użytkownik nie istnieje', async () => {
			const token = generateRefreshToken('1', 'USER');

			const res = await api()
				.get(endpoint)
				.set('User-Agent', 'jest-tests')
				.set('Cookie', [`refresh_token=${token}`]);

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});
	});

	describe('/auth/logout (DELETE)', () => {
		let endpoint = '/auth/logout';

		it('Użytkownik powinien móc się wylogować', async () => {
			const res = await auth(api, userToken.accessToken).delete(endpoint);

			if (res.status !== 204) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await auth(api).post(endpoint);

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await auth(api, 'INVALID').post(endpoint);

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});
	});
});

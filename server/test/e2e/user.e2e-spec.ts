import request from 'supertest';
import { auth } from '../utils/auth.util';
import { app, db, prisma } from '../setup/e2e.setup';
import { generateAccessToken } from '../utils/jwt.util';
import {
	CreateUserData,
	InvalidUserData,
	SkipUserQuery,
	UpdateUserByAdminData,
	UpdateUserByEmployeeData,
	UpdateUserByUserData,
} from '../data/user.data';
import { checkData, checkQuery } from '../helper/data_check.helper';
import { User } from '../../prisma/generated/prisma/browser';

describe('UserController', () => {
	const api = () => request(app.getHttpServer());

	let user: User;
	let other: User;

	let userToken: string;
	let otherToken: string;
	let adminToken: string;
	let employeeToken: string;

	beforeAll(async () => {
		await prisma.$executeRawUnsafe('BEGIN');

		user = await db.createUser();
		other = await db.createUser();

		userToken = generateAccessToken(user.user_id, 'USER');
		otherToken = generateAccessToken(other.user_id, 'USER');
		adminToken = generateAccessToken('0', 'ADMIN');
		employeeToken = generateAccessToken('0', 'EMPLOYEE');
	});

	afterAll(async () => {
		await prisma.$executeRawUnsafe('ROLLBACK');
	});

	describe('/users/:id (GET)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/users/${user.user_id}`;
		});

		it('Użytkownik powinien móc pobrać własne dane', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: user, skip: SkipUserQuery });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Użytkownik nie powinien móc pobrać danych innego użytkownika', async () => {
			const res = await auth(api, otherToken).get(endpoint);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Administrator powinien móc pobrać dane dowolnego użytkownika', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: user, skip: SkipUserQuery });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Pracownik powinien móc pobrać dane dowolnego użytkownika', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: user, skip: SkipUserQuery });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await auth(api).get(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await auth(api, 'INVALID').get(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});
	});

	describe('/users (GET)', () => {
		const endpoint = '/users';

		it('Administrator powinien móc pobrać listę użytkowników', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Pracownik powinien móc pobrać listę użytkowników', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Użytkownik nie powinien móc pobrać listy użytkowników', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić wyszukiwanego użytkownika na podstawie danych w query', async () => {
			await checkQuery({
				api: auth(api, adminToken).get(endpoint),
				obj: user,
				skip: SkipUserQuery,
			});
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await auth(api).get(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await auth(api, 'INVALID').get(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});
	});

	describe('/users (POST)', () => {
		const endpoint = '/users';

		it('Administrator powinien móc dodać nowego użytkownika', async () => {
			const dto = CreateUserData('USER');

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: dto, skip: ['password'] });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Pracownik powinien móc dodać nowego użytkownika', async () => {
			const dto = CreateUserData();

			const res = await auth(api, employeeToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: dto, skip: ['password'] });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Użytkownik nie powinien móc dodać nowego użytkownika', async () => {
			const dto = CreateUserData();

			const res = await auth(api, userToken).post(endpoint).send(dto);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd przy braku wymaganych danych', async () => {
			const res = await auth(api, adminToken).post(endpoint).send({});

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowych danych wejściowych', async () => {
			const invalidSets = InvalidUserData;

			for (const field of Object.keys(invalidSets)) {
				const invalidValues = invalidSets[field];

				for (const value of invalidValues) {
					const dto = {
						...CreateUserData,
						[field]: value,
					};

					const res = await auth(api, adminToken).post(endpoint).send(dto);

					if (res.status !== 400) {
						throw new Error(JSON.stringify(res.body));
					}
				}
			}
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await auth(api).post(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await auth(api, 'INVALID').post(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});
	});

	describe('/users/:id (UPDATE)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/users/${user.user_id}`;
		});

		it('Użytkownik powinien móc zaktualizować własne dane', async () => {
			const data = UpdateUserByUserData;

			const res = await auth(api, userToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data, skip: ['password'] });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Administrator powinien móc zaktualizować dane dowolnego użytkownika', async () => {
			const data = UpdateUserByAdminData;

			const res = await auth(api, adminToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data, skip: ['password'] });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Pracownik powinien móc zaktualizować dane dowolnego użytkownika', async () => {
			const data = UpdateUserByEmployeeData;

			const res = await auth(api, employeeToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data, skip: ['password'] });

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Użytkownik nie powinien móc zaktualizować danych innego użytkownika', async () => {
			const data = UpdateUserByUserData;

			const res = await auth(api, otherToken).put(endpoint).send(data);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await auth(api).put(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await auth(api, 'INVALID').put(endpoint);

			if (res.status !== 401) {
				throw new Error(JSON.stringify(res.body));
			}
		});
	});
});

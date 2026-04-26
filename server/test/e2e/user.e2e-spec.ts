import request from 'supertest';
import { User, UserRole } from '../../prisma/generated/prisma/client';
import { app, db } from '../setup';
import { auth } from '../utils/auth.util';
import { generateAccessToken } from '../utils/jwt.util';
import { compareData, compareGetData, compareGetIncorrectData } from '../helper/compare_data.helper';
import { omit } from '../helper/filter_data.helper';
import { generateUser } from '../../prisma/helper/generate_user.helper';

describe('UserController', () => {
	const api = () => request(app.getHttpServer());

	let client: User;
	let clientSecond: User;

	let clientToken: string;
	let clientSecondToken: string;
	let adminToken: string;
	let employeeToken: string;

	beforeAll(async () => {
		client = await db.createUser();
		clientSecond = await db.createUser();

		clientToken = generateAccessToken(client.user_id, 'CLIENT');
		clientSecondToken = generateAccessToken(clientSecond.user_id, 'CLIENT');
		adminToken = generateAccessToken(0, 'ADMIN');
		employeeToken = generateAccessToken(0, 'EMPLOYEE');
	});

	describe('/users/:id (GET)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/users/${client.user_id}`;
		});

		it('Klient powinien móc pobrać własne dane', async () => {
			const res = await auth(api, clientToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			compareData(res.body, client);

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Klient nie powinien móc pobrać czyiś danych', async () => {
			const res = await auth(api, clientSecondToken).get(endpoint);

			expect(res.status).toBe(403);
		});

		it('Administrator powinien móc pobrać czyjeś dane', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			expect(res.status).toBe(200);
		});

		it('Pracownik powinien móc pobrać czyjeś dane', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			expect(res.status).toBe(200);
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await auth(api).get(endpoint);

			expect(res.status).toBe(401);
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await auth(api, 'INVALID').get(endpoint);

			expect(res.status).toBe(401);
		});
	});

	describe('/users/:id (GET)', () => {
		const endpoint = '/users/';

		it('Administrator powinien móc pobrać listę użytkowników', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			expect(res.status).toBe(200);
		});

		it('Pracownik powinien móc pobrać listę użytkowników', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			expect(res.status).toBe(200);
		});

		it('Użytkownik nie powinien móc pobrać listy użytkowników', async () => {
			const res = await auth(api, clientToken).get(endpoint);

			expect(res.status).toBe(403);
		});

		it('Powinno zwrócić wyszukiwanego użytkownika na podstawie danych w query', async () => {
			const filteredClient = {
				...omit(client, [
					'user_id',
					'profession',
					'password_hash',
					'id_card_issue',
					'id_card_expiry',
					'monthly_net_income',
					'main_income_sources',
				]),

				cursor: client.user_id,
				limit: 5,
				created_at_gte: client.created_at,
				created_at_lte: client.created_at,
				updated_at_gte: client.updated_at,
				updated_at_lte: client.updated_at,
			};

			await compareGetData(filteredClient, api, adminToken, endpoint);
		});

		it('Powinno zwrócić błąd w przypadku błędnych typów danych w query', async () => {
			const data = {
				cursor: [null, 0, new Date(), 'text'],
				limit: [null, 0, new Date(), 'a'.repeat(15)],
				code: [null, 0, new Date(), 'text'],
				role: [null, 0, new Date(), 'text'],
				first_name: [null, 0, new Date(), 'a', 'a'.repeat(51)],
				last_name: [null, 0, new Date(), 'a', 'a'.repeat(51)],
				date_of_birth: [null, 0, 'a'],
				pesel: [null, 0, new Date(), 'a'.repeat(11)],
				email: [null, 0, new Date(), 'a'],
				phone_number: [null, 0, new Date(), 'a'.repeat(11), 'a'.repeat(9)],
				street: [null, 0, new Date(), 'a', 'a'.repeat(81)],
				city: [null, 0, new Date(), 'a', 'a'.repeat(81)],
				postal_code: [null, 0, new Date(), 'a', 'a'.repeat(5), 'aa-aaa'],
				id_card_number: [null, 0, new Date(), 'a'.repeat(21)],
				updated_at: [null, 'text'],
				created_at: [null, 'text'],
				updated_at_gte: [null, 'text'],
				updated_at_lte: [null, 'text'],
				created_at_lte: [null, 'text'],
				created_at_gte: [null, 'text'],
			};

			await compareGetIncorrectData(data, api, adminToken, endpoint);
		});

		it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
			const res = await auth(api).get(endpoint);

			expect(res.status).toBe(401);
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
			const res = await auth(api, 'INVALID').get(endpoint);

			expect(res.status).toBe(401);
		});
	});

	describe('/users (POST)', () => {
		const endpoint = '/users';

		it('Administrator powinien móc dodać nowego użytkownika', async () => {
			const dto = await generateUser();

			const filteredClient = omit(dto, ['code', 'password_hash', 'is_active', 'updated_at', 'created_at']);

			const res = await auth(api, adminToken).post(endpoint).send(filteredClient);

			expect(res.status).toBe(201);

			compareData(res.body, filteredClient, [
				'user_id',
				'code',
				'password_hash',
				'is_active',
				'updated_at',
				'created_at',
			]);

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Pracownik powinien móc dodać nowego użytkownika', async () => {
			const dto = await generateUser();

			const filteredClient = omit(dto, [
				'code',
				'password_hash',
				'is_active',
				'updated_at',
				'created_at',
				'role',
			]);

			const res = await auth(api, employeeToken).post(endpoint).send(filteredClient);

			expect(res.status).toBe(201);

			compareData(res.body, filteredClient, [
				'user_id',
				'code',
				'role',
				'password_hash',
				'is_active',
				'updated_at',
				'created_at',
			]);

			expect(res.body.password_hash).toBeUndefined();
		});

		it('Pracownik powinien nie móc dodać nowego użytkownika z niedozwolonymi polami', async () => {
			const dto = await generateUser();

			const filteredClient = omit(dto, ['code', 'password_hash', 'is_active', 'updated_at', 'created_at']);

			const res = await auth(api, employeeToken).post(endpoint).send(filteredClient);

			expect(res.status).toBe(400);
		});

		it('Klient nie powinien móc dodać nowego użytkownika', async () => {
			const dto = await generateUser();

			const filteredClient = omit(dto, ['code', 'password_hash', 'is_active', 'updated_at', 'created_at']);

			const res = await auth(api, clientToken).post(endpoint).send(filteredClient);

			expect(res.status).toBe(403);
		});
	});

	// describe('/users (PATCH)', () => {
	// 	let endpoint: string;

	// 	beforeEach(async () => {
	// 		endpoint = `/users/${client.user_id}`;
	// 	});

	// 	it('Użytkownik powinien móc zaktualizować własne dane', async () => {
	// 		const data = UpdateUserByUserData;

	// 		const res = await auth(api, userToken).put(endpoint).send(data);

	// 		if (res.status !== 200) {
	// 			throw new Error(JSON.stringify(res.body));
	// 		}

	// 		checkData({ res, obj: data, skip: ['password'] });

	// 		expect(res.body.password_hash).toBeUndefined();
	// 	});

	// 	it('Administrator powinien móc zaktualizować dane dowolnego użytkownika', async () => {
	// 		const data = UpdateUserByAdminData;

	// 		const res = await auth(api, adminToken).put(endpoint).send(data);

	// 		if (res.status !== 200) {
	// 			throw new Error(JSON.stringify(res.body));
	// 		}

	// 		checkData({ res, obj: data, skip: ['password'] });

	// 		expect(res.body.password_hash).toBeUndefined();
	// 	});

	// 	it('Pracownik powinien móc zaktualizować dane dowolnego użytkownika', async () => {
	// 		const data = UpdateUserByEmployeeData;

	// 		const res = await auth(api, employeeToken).put(endpoint).send(data);

	// 		if (res.status !== 200) {
	// 			throw new Error(JSON.stringify(res.body));
	// 		}

	// 		checkData({ res, obj: data, skip: ['password'] });

	// 		expect(res.body.password_hash).toBeUndefined();
	// 	});

	// 	it('Użytkownik nie powinien móc zaktualizować danych innego użytkownika', async () => {
	// 		const data = UpdateUserByUserData;

	// 		const res = await auth(api, otherToken).put(endpoint).send(data);

	// 		if (res.status !== 403) {
	// 			throw new Error(JSON.stringify(res.body));
	// 		}
	// 	});

	// 	it('Powinno zwrócić błąd w przypadku braku tokena', async () => {
	// 		const res = await auth(api).put(endpoint);

	// 		if (res.status !== 401) {
	// 			throw new Error(JSON.stringify(res.body));
	// 		}
	// 	});

	// 	it('Powinno zwrócić błąd w przypadku nieprawidłowego tokena', async () => {
	// 		const res = await auth(api, 'INVALID').put(endpoint);

	// 		if (res.status !== 401) {
	// 			throw new Error(JSON.stringify(res.body));
	// 		}
	// 	});
	// });
});

import request from 'supertest';
import { auth } from '../utils/auth.util';
import { app, db, prisma } from '../setup/e2e.setup';
import { generateAccessToken } from '../utils/jwt.util';
import { randomUUID } from 'crypto';
import {
	CreateAccountData,
	InvalidAccountData,
	SkipAccountQuery,
	UpdateAccountByAdminData,
	UpdateAccountByUserData,
} from '../data/account.data';
import { checkData, checkQuery } from '../helper/data_check.helper';
import { SkipUserQuery } from '../data/user.data';
import { Account, AccountRole, User } from '../../prisma/generated/prisma/browser';

describe('AccountController', () => {
	const api = () => request(app.getHttpServer());

	let user: User;
	let other: User;
	let account: Account;

	let userToken: string;
	let otherToken: string;
	let adminToken: string;
	let employeeToken: string;

	beforeAll(async () => {
		await prisma.$executeRawUnsafe('BEGIN');

		user = await db.createUser();
		other = await db.createUser();
		account = await db.createAccount();

		userToken = generateAccessToken(user.user_id, 'USER');
		otherToken = generateAccessToken(other.user_id, 'USER');
		adminToken = generateAccessToken('0', 'ADMIN');
		employeeToken = generateAccessToken('0', 'EMPLOYEE');
	});

	afterAll(async () => {
		await prisma.$executeRawUnsafe('ROLLBACK');
	});

	describe('/accounts/:id (POST)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/accounts/${account.account_id}`;
		});

		it('Użytkownik nie powinien móc dodać użytkownika do konta', async () => {
			await prisma.userAccount.deleteMany();

			const res = await auth(api, userToken)
				.post(endpoint)
				.send({ user_id: other.user_id, role: AccountRole.CO_OWNER });

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Administrator powinien móc dodać użytkownika do konta', async () => {
			const res = await auth(api, adminToken)
				.post(endpoint)
				.send({ user_id: user.user_id, role: AccountRole.OWNER });

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: user, skip: SkipUserQuery });
		});

		it('Pracownik powinien móc dodać użytkownika do konta', async () => {
			const res = await auth(api, adminToken)
				.post(endpoint)
				.send({ user_id: other.user_id, role: AccountRole.CO_OWNER });

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: other, skip: SkipUserQuery });
		});

		it('Powinno zwrócić błąd przy braku wymaganych danych', async () => {
			const res = await auth(api, adminToken).post(endpoint).send({});

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nie istniejącego użytkownika', async () => {
			const randomUuid = randomUUID();

			const res = await auth(api, adminToken)
				.post(endpoint)
				.send({ user_id: randomUuid, role: AccountRole.CO_OWNER });

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nie istniejącego konta', async () => {
			const randomUuid = randomUUID();

			const res = await auth(api, adminToken)
				.post(`/accounts/${randomUuid}`)
				.send({ user_id: user.user_id, role: AccountRole.CO_OWNER });

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowych danych wejściowych', async () => {
			const invalidSets = { user_id: ['', 'A', 123] };

			for (const field of Object.keys(invalidSets)) {
				const invalidValues = invalidSets[field];

				for (const value of invalidValues) {
					const dto = {
						...CreateAccountData,
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

	describe('/accounts/:id (GET)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/accounts/${account.account_id}`;
		});

		it('Użytkownik powinien móc pobrać dane własnego konta', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: account });
		});

		it('Administrator powinien móc pobrać dane dowolnego konta', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: account });
		});

		it('Pracownik powinien móc pobrać dane dowolnego konta', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: account });
		});

		it('Użytkownik powinien móc pobrać dane konta którego jest współwłaścicielem', async () => {
			const res = await auth(api, otherToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: account });
		});

		it('Użytkownik nie powinien móc pobrać danych innego konta', async () => {
			const token = generateAccessToken('1', 'USER');

			const res = await auth(api, token).get(endpoint);

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
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

	describe('/accounts (GET)', () => {
		let endpoint = '/accounts';

		it('Administrator powinien móc pobrać listę kont', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body).toBeInstanceOf(Array);
			expect(res.body.length).toBeGreaterThan(0);
		});

		it('Pracownik powinien móc pobrać listę kont', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body).toBeInstanceOf(Array);
			expect(res.body.length).toBeGreaterThan(0);
		});

		it('Użytkownik powinien móc pobrać listę swoich kont', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body).toBeInstanceOf(Array);
			expect(res.body.length).toBeGreaterThan(0);

			checkData({ res, obj: account, skip: ['account_id'] });
		});

		it('Użytkownik powinien móc pobrać listę kont których jest współwłaścicielem', async () => {
			const res = await auth(api, otherToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body).toBeInstanceOf(Array);
			expect(res.body.length).toBeGreaterThan(0);

			checkData({ res, obj: account, skip: ['account_id'] });
		});

		it('Powinno zwrócić wyszukiwane konta na podstawie danych w query', async () => {
			await checkQuery({
				api: auth(api, adminToken).get(endpoint),
				obj: account,
				skip: SkipAccountQuery,
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

	describe('/accounts (POST)', () => {
		let endpoint = '/accounts';

		it('Administrator powinien móc dodać nowe konto', async () => {
			const dto = { ...CreateAccountData, user_id: user.user_id };

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body['currency']).toEqual(dto['currency']);
		});

		it('Pracownik powinien móc dodać nowe konto', async () => {
			const dto = { ...CreateAccountData, user_id: other.user_id };

			const res = await auth(api, employeeToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body['currency']).toEqual(dto['currency']);
		});

		it('Użytkownik nie powinien móc dodać nowego konta', async () => {
			const dto = { ...CreateAccountData, user_id: user.user_id };

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

		it('Powinno zwrócić błąd w przypadku nie istniejącego użytkownika', async () => {
			const randomUuid = randomUUID();

			const dto = { ...CreateAccountData, user_id: randomUuid };

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowych danych wejściowych', async () => {
			const invalidSets = InvalidAccountData;

			for (const field of Object.keys(invalidSets)) {
				const invalidValues = invalidSets[field];

				for (const value of invalidValues) {
					const dto = {
						...CreateAccountData,
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

	describe('/accounts/:id (UPDATE)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/accounts/${account.account_id}`;
		});

		it('Użytkownik powinien móc zaktualizować własne konto', async () => {
			const data = UpdateAccountByUserData;

			const res = await auth(api, userToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data });
		});

		it('Administrator powinien móc zaktualizować dane dowolnego konta', async () => {
			const data = UpdateAccountByAdminData;

			const res = await auth(api, adminToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data });
		});

		it('Pracownik powinien móc zaktualizować dane dowolnego konta', async () => {
			const data = UpdateAccountByAdminData;

			const res = await auth(api, employeeToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data });
		});

		it('Użytkownik powinien móc zaktualizować dane konta którego jest współwaścicielem', async () => {
			const data = UpdateAccountByUserData;

			const res = await auth(api, otherToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data });
		});

		it('Użytkownik nie powinien móc zaktualizować danych konta do którego nie jest współwaścicielem', async () => {
			const data = UpdateAccountByUserData;

			const token = generateAccessToken('1', 'USER');

			const res = await auth(api, token).put(endpoint).send(data);

			if (res.status !== 404) {
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

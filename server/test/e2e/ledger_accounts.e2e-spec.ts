import request from 'supertest';
import { auth } from '../utils/auth.util';
import { app, db, prisma } from '../setup/e2e.setup';
import { generateAccessToken } from '../utils/jwt.util';
import { checkData, checkQuery } from '../helper/data_check.helper';
import { CreateLedgerAccountData, InvalidLedgerAccountData, SkipLedgerAccountQuery } from '../data/ledger_account.data';
import { LedgerAccount } from '../../prisma/generated/prisma/browser';

describe('LedgerAccountController', () => {
	const api = () => request(app.getHttpServer());

	let ledgerAccount: LedgerAccount;

	let userToken: string;
	let adminToken: string;
	let employeeToken: string;

	beforeAll(async () => {
		await prisma.$executeRawUnsafe('BEGIN');

		const user = await db.createUser();
		const userAccount = await db.createAccount(user.user_id);

		ledgerAccount = await db.createLedgerAccount();

		userToken = generateAccessToken(user.user_id, 'USER');
		adminToken = generateAccessToken('0', 'ADMIN');
		employeeToken = generateAccessToken('0', 'EMPLOYEE');
	});

	afterAll(async () => {
		await prisma.$executeRawUnsafe('ROLLBACK');
	});

	describe('/ledger/accounts/:id (GET)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/ledger/accounts/${ledgerAccount.ledger_id}`;
		});

		it('Administrator powinien móc pobrać dane wybranego konta w księdze', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerAccount });
		});

		it('Pracownik powinien móc pobrać dane dane wybranego konta w księdze', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerAccount });
		});

		it('Użytkownik nie powinien móc pobrać dane swojego konta w księdze', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 403) {
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

	describe('/ledger/accounts (GET)', () => {
		let endpoint = '/ledger/accounts';

		it('Administrator powinien móc pobrać listę kont księgowych', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerAccount });
		});

		it('Pracownik powinien móc pobrać listę kont księgowych', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerAccount });
		});

		it('Użytkownik nie powinien móc pobrać listy swoich kont księgowych', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić wyszukiwane konta księgowe na podstawie danych w query', async () => {
			await checkQuery({
				api: auth(api, adminToken).get(endpoint),
				obj: ledgerAccount,
				skip: SkipLedgerAccountQuery,
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

	describe('/ledger/accounts (POST)', () => {
		let endpoint = '/ledger/accounts';

		it('Administrator powinien móc utowrzyć nowe konto księgowe', async () => {
			const dto = CreateLedgerAccountData;

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: CreateLedgerAccountData, skip: ['ledger_id'] });
		});

		it('Pracownik nie powinien móc utowrzyć nowe konto księgowe', async () => {
			const dto = CreateLedgerAccountData;

			const res = await auth(api, employeeToken).post(endpoint).send(dto);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Użytkownik nie powinien móc utowrzyć nowego konta księgowego', async () => {
			const dto = CreateLedgerAccountData;

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
			const invalidSets = InvalidLedgerAccountData;

			for (const field of Object.keys(invalidSets)) {
				const invalidValues = invalidSets[field];

				for (const value of invalidValues) {
					const dto = {
						...CreateLedgerAccountData,
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
});

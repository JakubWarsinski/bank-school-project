import request from 'supertest';
import { auth } from '../utils/auth.util';
import { app, db, prisma } from '../setup/e2e.setup';
import { generateAccessToken } from '../utils/jwt.util';
import { CreateTransactionData, InvalidTransactionData, SkipTransactionQuery } from '../data/transaction.data';
import { checkData, checkQuery } from '../helper/data_check.helper';
import { Account, Transaction, User } from '../../prisma/generated/prisma/browser';

describe('TransactionController', () => {
	const api = () => request(app.getHttpServer());

	let user: User;
	let other: User;

	let userAccount: Account;
	let otherAccount: Account;

	let userToken: string;
	let otherToken: string;
	let adminToken: string;
	let employeeToken: string;

	let transaction: Transaction;

	beforeAll(async () => {
		await prisma.$executeRawUnsafe('BEGIN');

		user = await db.createUser();
		other = await db.createUser();

		userAccount = await db.createAccount(user.user_id);
		otherAccount = await db.createAccount(other.user_id);

		userToken = generateAccessToken(user.user_id, 'USER');
		otherToken = generateAccessToken(other.user_id, 'USER');
		adminToken = generateAccessToken('0', 'ADMIN');
		employeeToken = generateAccessToken('0', 'EMPLOYEE');

		transaction = await db.createTransaction(userAccount.account_id, otherAccount.account_id);
	});

	afterAll(async () => {
		await prisma.$executeRawUnsafe(`TRUNCATE TABLE transactions, accounts, users RESTART IDENTITY CASCADE;`);
	});

	describe('/transactions/:id (GET)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/transactions/${transaction.transaction_id}`;
		});

		it('Użytkownik powinien móc pobrać dane transakcji którą wykonał', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Administrator powinien móc pobrać dane dowolnej transakcji', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Pracownik powinien móc pobrać dane dowolnej transakcji', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Użytkownik powinien móc pobrać dane transakcji która go dotyczy', async () => {
			const res = await auth(api, otherToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Użytkownik nie powinien móc pobrać danych innej transakcji', async () => {
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

	describe('/transactions (GET)', () => {
		let endpoint = '/transactions';

		it('Administrator powinien móc pobrać listę transakcji', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Pracownik powinien móc pobrać listę transakcji', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Użytkownik powinien móc pobrać listę swoich transakcji', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Użytkownik powinien móc pobrać listę transakcji które go dotyczą', async () => {
			const res = await auth(api, otherToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: transaction });
		});

		it('Powinno zwrócić wyszukiwane transakcje na podstawie danych w query', async () => {
			await checkQuery({
				api: auth(api, adminToken).get(endpoint),
				obj: transaction,
				skip: SkipTransactionQuery,
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

	describe('/transactions (POST)', () => {
		let endpoint = '/transactions';

		it('Administrator powinien móc utworzyć nową transakcje', async () => {
			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: otherAccount.iban };

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: CreateTransactionData });

			const blocked_amount = Number(userAccount.blocked_amount);
			const avaible_balance = Number(userAccount.available_balance);

			const userRes = await auth(api, userToken).get(`/accounts/${userAccount.account_id}`);

			if (userRes.status !== 200) {
				console.log(userRes.status);
				throw new Error(JSON.stringify(userRes.body));
			}

			expect(Number(userRes.body.available_balance)).toBeLessThan(avaible_balance);
			expect(Number(userRes.body.blocked_amount)).toBeGreaterThan(blocked_amount);
		});

		it('Pracownik powinien móc utworzyć nową transakcje', async () => {
			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: otherAccount.iban };

			const res = await auth(api, employeeToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: CreateTransactionData });

			const blocked_amount = Number(userAccount.blocked_amount);
			const avaible_balance = Number(userAccount.available_balance);

			const userRes = await auth(api, userToken).get(`/accounts/${userAccount.account_id}`);

			if (userRes.status !== 200) {
				console.log(userRes.status);
				throw new Error(JSON.stringify(userRes.body));
			}

			expect(Number(userRes.body.available_balance)).toBeLessThan(avaible_balance);
			expect(Number(userRes.body.blocked_amount)).toBeGreaterThan(blocked_amount);
		});

		it('Użytkownik powinien móc utworzyć nową transakcje', async () => {
			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: otherAccount.iban };

			const res = await auth(api, userToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: CreateTransactionData });

			const blocked_amount = Number(userAccount.blocked_amount);
			const avaible_balance = Number(userAccount.available_balance);

			const userRes = await auth(api, userToken).get(`/accounts/${userAccount.account_id}`);

			if (userRes.status !== 200) {
				console.log(userRes.status);
				throw new Error(JSON.stringify(userRes.body));
			}

			expect(Number(userRes.body.available_balance)).toBeLessThan(avaible_balance);
			expect(Number(userRes.body.blocked_amount)).toBeGreaterThan(blocked_amount);
		});

		it('Użytkownik nie powinien móc utworzyć nowej transakcje z nie swojego konta', async () => {
			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: otherAccount.iban };

			const res = await auth(api, otherToken).post(endpoint).send(dto);

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd przy braku wymaganych danych', async () => {
			const res = await auth(api, adminToken).post(endpoint).send({});

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku błędnego IBAN nadawcy', async () => {
			const randomCode = '1'.repeat(28);

			const dto = { ...CreateTransactionData, sender: randomCode, receiver: otherAccount.iban };

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku błędnego IBAN odbiorcy', async () => {
			const randomCode = '1'.repeat(28);

			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: randomCode };

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku kiedy kwota jest mniejsza lub równa zeru', async () => {
			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: otherAccount.iban };

			dto.amount = 0;

			const res = await auth(api, userToken).post(endpoint).send(dto);

			if (res.status !== 400) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku niewystarczających środków na koncie', async () => {
			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: otherAccount.iban };

			dto.amount = 1000;

			const res = await auth(api, userToken).post(endpoint).send(dto);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku przekroczenia limitu środków', async () => {
			const dto = { ...CreateTransactionData, sender: userAccount.iban, receiver: otherAccount.iban };

			dto.amount = 6000;

			const res = await auth(api, userToken).post(endpoint).send(dto);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nineprawidłowych danych wejściowych', async () => {
			const invalidSets = {
				...InvalidTransactionData,
				sender: userAccount.iban,
				receiver: otherAccount.iban,
			};

			for (const field of Object.keys(invalidSets)) {
				const invalidValues = invalidSets[field];

				for (const value of invalidValues) {
					const dto = {
						...CreateTransactionData,
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
});

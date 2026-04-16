import request from 'supertest';
import { auth } from '../utils/auth.util';
import { app, db, prisma } from '../setup/e2e.setup';
import { generateAccessToken } from '../utils/jwt.util';
import { randomUUID } from 'crypto';
import {
	CreateCardData,
	InvalidCardData,
	SkipCardData,
	SkipCardQuery,
	UpdateCardByAdminData,
	UpdateCardByUserData,
} from '../data/card.data';
import { checkData, checkQuery } from '../helper/data_check.helper';
import { Account, Card, User } from '../../prisma/generated/prisma/browser';

describe('CardController', () => {
	const api = () => request(app.getHttpServer());

	let user: User;
	let other: User;
	let card: Card;
	let account: Account;

	let userToken: string;
	let otherToken: string;
	let adminToken: string;
	let employeeToken: string;

	beforeAll(async () => {
		await prisma.$executeRawUnsafe('BEGIN');

		user = await db.createUser();
		other = await db.createUser();
		account = await db.createAccount(user.user_id);
		card = await db.createCard(account.account_id);

		await db.addUserToAccount(account.account_id, other.user_id);

		userToken = generateAccessToken(user.user_id, 'USER');
		otherToken = generateAccessToken(other.user_id, 'USER');
		adminToken = generateAccessToken('0', 'ADMIN');
		employeeToken = generateAccessToken('0', 'EMPLOYEE');
	});

	afterAll(async () => {
		await prisma.$executeRawUnsafe('ROLLBACK');
	});

	describe('/cards/:id (GET)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/cards/${card.card_id}`;
		});

		it('Użytkownik powinien móc pobrać dane własnej karty', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Administrator powinien móc pobrać dane dowolnej karty', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Pracownik powinien móc pobrać dane dowolnej karty', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Użytkownik powinien móc pobrać dane karty należącej do konta, którego jest współwłaścicielem', async () => {
			const res = await auth(api, otherToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Użytkownik nie powinien móc pobrać danych karty należącej do konta, którego nie jest współwłaścicielem', async () => {
			const token = generateAccessToken('999', 'USER');

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

	describe('/cards (GET)', () => {
		let endpoint = '/cards';

		it('Administrator powinien móc pobrać listę kart', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			expect(res.body).toBeInstanceOf(Array);
			expect(res.body.length).toBeGreaterThan(0);

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Pracownik powinien móc pobrać listę kart', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Użytkownik powinien móc pobrać listę swoich kart', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Użytkownik powinien móc pobrać listę kart dla konta którego jest współwłaścicielem', async () => {
			const res = await auth(api, otherToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: card, skip: SkipCardData });
		});

		it('Powinno zwrócić wyszukiwane karty na podstawie danych w query', async () => {
			await checkQuery({
				api: auth(api, adminToken).get(endpoint),
				obj: card,
				skip: SkipCardQuery,
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

	describe('/cards (POST)', () => {
		let endpoint = '/cards';

		it('Administrator powinien móc dodać nową karte', async () => {
			const dto = { ...CreateCardData, account_id: account.account_id };

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Pracownik powinien móc dodać nową karte', async () => {
			const dto = { ...CreateCardData, account_id: account.account_id };

			const res = await auth(api, employeeToken).post(endpoint).send(dto);

			if (res.status !== 201) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Użytkownik nie powinien móc dodać nowej karty', async () => {
			const dto = { ...CreateCardData, account_id: account.account_id };

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

		it('Powinno zwrócić błąd w przypadku nie istniejącego konta', async () => {
			const randomUuid = randomUUID();

			const dto = { ...CreateCardData, account_id: randomUuid };

			const res = await auth(api, adminToken).post(endpoint).send(dto);

			if (res.status !== 404) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić błąd w przypadku nieprawidłowych danych wejściowych', async () => {
			const invalidSets = InvalidCardData;

			for (const field of Object.keys(invalidSets)) {
				const invalidValues = invalidSets[field];

				for (const value of invalidValues) {
					const dto = {
						...CreateCardData,
						accountId: account.account_id,
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

	describe('/cards/:id (UPDATE)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/cards/${card.card_id}`;
		});

		it('Użytkownik powinien móc zaktualizować kartę należącą do jego konta', async () => {
			const data = UpdateCardByUserData;

			const res = await auth(api, userToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data, skip: ['pin'] });
		});

		it('Administrator powinien móc zaktualizować dane dowolnej karty', async () => {
			const data = UpdateCardByAdminData;

			const res = await auth(api, adminToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data, skip: ['pin'] });
		});

		it('Pracownik powinien móc zaktualizować dane dowolnej karty', async () => {
			const data = UpdateCardByAdminData;

			const res = await auth(api, employeeToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data, skip: ['pin'] });
		});

		it('Użytkownik powinien móc zaktualizować dane karty, konta którego jest współwłaścicielem', async () => {
			const data = UpdateCardByUserData;

			const res = await auth(api, otherToken).put(endpoint).send(data);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: data, skip: ['pin'] });
		});

		it('Użytkownik nie powinien móc zaktualizować danych karty, konta którego nie jest współwłaścicielem', async () => {
			const data = UpdateCardByUserData;

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

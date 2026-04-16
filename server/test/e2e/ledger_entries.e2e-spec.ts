import request from 'supertest';
import { auth } from '../utils/auth.util';
import { app, db, prisma } from '../setup/e2e.setup';
import { generateAccessToken } from '../utils/jwt.util';
import { checkData, checkQuery } from '../helper/data_check.helper';
import { LedgerEntry } from '../../prisma/generated/prisma/browser';

describe('LedgerEntryController', () => {
	const api = () => request(app.getHttpServer());

	let ledgerEntry: LedgerEntry;

	let userToken: string;
	let adminToken: string;
	let employeeToken: string;

	beforeAll(async () => {
		await prisma.$executeRawUnsafe('BEGIN');

		const user = await db.createUser();
		const other = await db.createUser();

		const userAccount = await db.createAccount(user.user_id);
		const otherAccount = await db.createAccount(other.user_id);

		const transaction = await db.createTransaction(userAccount.account_id, otherAccount.account_id);

		const ledgerAccount = await db.createLedgerAccount();
		const ledgerJournal = await db.createLedgerJournal(transaction.transaction_id);

		ledgerEntry = await db.createLedgerEntry(ledgerAccount.ledger_id, ledgerJournal.ledger_id);

		userToken = generateAccessToken(user.user_id, 'USER');
		adminToken = generateAccessToken('0', 'ADMIN');
		employeeToken = generateAccessToken('0', 'EMPLOYEE');
	});

	afterAll(async () => {
		await prisma.$executeRawUnsafe('ROLLBACK');
	});

	describe('/ledger/entries/:id (GET)', () => {
		let endpoint: string;

		beforeEach(async () => {
			endpoint = `/ledger/entries/${ledgerEntry.ledger_id}`;
		});

		it('Administrator powinien móc pobrać dane wybranego wpisu księgowego', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerEntry });
		});

		it('Pracownik powinien móc pobrać dane dane wybranego wpisu księgowego', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerEntry });
		});

		it('Użytkownik nie powinien móc pobrać danych wpisu księgowego', async () => {
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

	describe('/ledger/entries (GET)', () => {
		let endpoint = '/ledger/entries';

		it('Administrator powinien móc pobrać listę wpisów księgowych', async () => {
			const res = await auth(api, adminToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerEntry });
		});

		it('Pracownik powinien móc pobrać listę wpisów księgowych', async () => {
			const res = await auth(api, employeeToken).get(endpoint);

			if (res.status !== 200) {
				throw new Error(JSON.stringify(res.body));
			}

			checkData({ res, obj: ledgerEntry });
		});

		it('Użytkownik nie powinien móc pobrać listy wpisów księgowych', async () => {
			const res = await auth(api, userToken).get(endpoint);

			if (res.status !== 403) {
				throw new Error(JSON.stringify(res.body));
			}
		});

		it('Powinno zwrócić wyszukiwane wpisy księgowe na podstawie danych w query', async () => {
			await checkQuery({
				api: auth(api, adminToken).get(endpoint),
				obj: ledgerEntry,
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
});

import * as argon2 from 'argon2';
import { randomInt } from 'crypto';
import { CountryCode, IBAN } from 'ibankit';
import { PrismaPg } from '@prisma/adapter-pg';
import { Account } from './generated/prisma/browser';
import { PrismaClient, User, UserRole } from './generated/prisma/client';

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
	const password = 'TestPassword1!';
	const password_hash = await argon2.hash(password);

	function randomCardNumber(): string {
		let numbers = '';

		for (let i = 0; i < 26; i++) {
			numbers += Math.floor(Math.random() * 10);
		}

		return numbers;
	}

	const randomUserCode = () =>
		`USER${Math.floor(Math.random() * 1000000000)
			.toString()
			.padStart(9, '0')}`;

	const randomTransactionCode = () =>
		`TRX${Math.floor(Math.random() * 1000000000000000)
			.toString()
			.padStart(16, '0')}`;

	await prisma.card.deleteMany({});
	await prisma.transaction.deleteMany({});
	await prisma.userAccount.deleteMany({});
	await prisma.account.deleteMany({});
	await prisma.session.deleteMany({});
	await prisma.user.deleteMany({});

	const usersData = [
		{
			first_name: 'Jan',
			last_name: 'Kowalski',
			date_of_birth: '1985-01-01',
			pesel: '85010112345',
			email: 'user1@test.pl',
			role: UserRole.CLIENT,
			id_card_number: 'ABC123456',
			id_card_issue: new Date('2010-03-15'),
			id_card_expiry: new Date('2025-03-15'),
			profession: 'Kierownik projektu',
			monthly_net_income: '7000 PLN',
			main_income_sources: 'Praca etatowa',
		},
		{
			first_name: 'Anna',
			last_name: 'Nowak',
			date_of_birth: '1990-05-15',
			pesel: '90051554321',
			email: 'user2@test.pl',
			role: UserRole.CLIENT,
			id_card_number: 'XYZ987654',
			id_card_issue: new Date('2015-07-20'),
			id_card_expiry: new Date('2030-07-20'),
			profession: 'Nauczyciel',
			monthly_net_income: '4500 PLN',
			main_income_sources: 'Praca etatowa, korepetycje',
		},
		{
			first_name: 'Piotr',
			last_name: 'Zieliński',
			date_of_birth: '1980-08-20',
			pesel: '80082098765',
			email: 'employee@test.pl',
			role: UserRole.EMPLOYEE,
			id_card_number: 'EMP456789',
			id_card_issue: new Date('2005-01-10'),
			id_card_expiry: new Date('2025-01-10'),
			profession: 'Pracownik banku',
			monthly_net_income: '9000 PLN',
			main_income_sources: 'Praca etatowa',
		},
		{
			first_name: 'Katarzyna',
			last_name: 'Wiśniewska',
			date_of_birth: '1975-12-10',
			pesel: '75121011111',
			email: 'admin@test.pl',
			role: UserRole.ADMIN,
			id_card_number: 'ADM111222',
			id_card_issue: new Date('2000-05-05'),
			id_card_expiry: new Date('2025-05-05'),
			profession: 'Administrator systemów',
			monthly_net_income: '12000 PLN',
			main_income_sources: 'Praca etatowa',
		},
	];

	const createdUsers: User[] = [];

	for (const client of usersData) {
		const user = await prisma.user.create({
			data: {
				code: randomUserCode(),
				role: client.role,
				first_name: client.first_name,
				last_name: client.last_name,
				date_of_birth: client.date_of_birth,
				pesel: client.pesel,
				email: client.email,
				phone_number: '600123456',
				street: 'Ulica 1',
				city: 'Warszawa',
				postal_code: '00-001',
				password_hash,
				id_card_number: client.id_card_number,
				id_card_issue: client.id_card_issue,
				id_card_expiry: client.id_card_expiry,
				profession: client.profession,
				monthly_net_income: client.monthly_net_income,
				main_income_sources: client.main_income_sources,
			},
		});

		createdUsers.push(user);
	}

	const clients = createdUsers.filter((u) => u.role === 'CLIENT');

	const createdAccounts: Account[] = [];

	for (const client of clients) {
		for (let i = 0; i < 5; i++) {
			const account = await prisma.account.create({
				data: {
					iban: IBAN.random(CountryCode.PL).toString(),
					currency: 'PLN',
					name: `Konto ${i + 1} - ${client.first_name}`,
					current_balance: 500.0,
					available_balance: 500.0,
					status: 'ACTIVE',
				},
			});

			await prisma.userAccount.create({
				data: {
					account_id: account.account_id,
					user_id: client.user_id,
					role: 'OWNER',
				},
			});

			const cardNumber = randomCardNumber();
			const lastFour = cardNumber.slice(-4);

			await prisma.card.create({
				data: {
					account_id: account.account_id,
					name: `Karta ${client.first_name}`,
					card_number_hash: await argon2.hash(cardNumber),
					last_digits: lastFour,
					cvv_hash: await argon2.hash('123'),
					pin_hash: await argon2.hash('1234'),
					expiry_month: Math.floor(Math.random() * 12) + 1,
					expiry_year: 2026,
					payment_limit: 5000,
					withdraw_limit: 2000,
					daily_payment_limit: 1000,
					daily_withdraw_limit: 500,
				},
			});

			createdAccounts.push(account);
		}
	}

	for (const sender of createdAccounts) {
		for (let i = 0; i < 5; i++) {
			let receiver = createdAccounts[randomInt(0, createdAccounts.length)];

			while (receiver.account_id === sender.account_id) {
				receiver = createdAccounts[randomInt(0, createdAccounts.length)];
			}

			await prisma.transaction.create({
				data: {
					code: randomTransactionCode(),
					status: 'COMPLETED',
					type: 'INTERNAL_TRANSFER',
					sender_id: sender.account_id,
					receiver_id: receiver.account_id,
					title: `Przelew testowy ${i + 1}`,
					description: `Transakcja testowa ${i + 1} pomiędzy kontami`,
					amount: 500.0,
					currency: 'PLN',
					booking_date: new Date(),
				},
			});
		}
	}

	console.log('Seeding completed!');
}

main()
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

import { PrismaClient, UserRole } from './generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { generateUser } from './helper/generate_user.helper';
import { generateAccount } from './helper/generate_account.helper';
import { generateCard } from './helper/generate_card.helper';
import { generateTransaction } from './helper/generate_transaction.helper';
import { generateRandomInt } from './helper/random_generator.helper';
import { generateNotification } from './helper/generate_notification.helper';
import { generateUserAccount } from './helper/generate_user_account.helper';

const prisma = new PrismaClient({
	adapter: new PrismaBetterSqlite3({
		url: process.env.DATABASE_URL!,
	}),
});

async function main() {
	await prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence`);

	await prisma.card.deleteMany({});
	await prisma.transaction.deleteMany({});
	await prisma.userAccount.deleteMany({});
	await prisma.account.deleteMany({});
	await prisma.session.deleteMany({});
	await prisma.user.deleteMany({});

	const client = await generateUser(UserRole.CLIENT, 'user@test.gmail');
	const admin = await generateUser(UserRole.ADMIN, 'admin@test.gmail');
	const emplyee = await generateUser(UserRole.EMPLOYEE, 'employee@test.gmail');

	const userAmount = await prisma.user.createMany({
		data: [client, admin, emplyee, ...(await Promise.all(Array.from({ length: 10 }).map(() => generateUser())))],
	});

	await prisma.account.createMany({
		data: await Promise.all(Array.from({ length: userAmount.count }).map(() => generateAccount())),
	});

	const users = await prisma.user.findMany();
	const accounts = await prisma.account.findMany();

	await prisma.userAccount.createMany({
		data: users.map((user, index) => generateUserAccount(user.user_id, accounts[index].account_id)),
	});

	await prisma.card.createMany({
		data: await Promise.all(accounts.map(({ account_id }) => generateCard(account_id))),
	});

	await prisma.notification.createMany({
		data: await Promise.all(users.map(({ user_id }) => generateNotification(user_id))),
	});

	await prisma.transaction.createMany({
		data: accounts.flatMap(({ account_id }) =>
			Array.from({ length: 20 }, () => generateTransaction(generateRandomInt(1, users.length), account_id)),
		),
	});

	console.log('Seeding completed!');
}

main()
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

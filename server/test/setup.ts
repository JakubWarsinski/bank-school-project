import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { Test } from '@nestjs/testing';
import { setupApp } from '../src/setup-app';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { DbHelper } from './utils/db.util';
import { PrismaService } from '../src/prisma/prisma.service';

export let db: DbHelper;
export let app: INestApplication;

beforeAll(async () => {
	try {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		setupApp(app);

		await app.init();

		const prisma = app.get(PrismaService);

		db = new DbHelper(prisma);
	} catch (error) {
		console.error(error);
		throw error;
	}
});

afterAll(async () => {
	await app.close();
});

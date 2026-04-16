import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import cookieParser from 'cookie-parser';
import { AppModule } from '@/app.module';
import { DbHelper } from '../utils/db.util';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { GlobalValidationPipe } from '@/config/pipe.config';

export let db: DbHelper;
export let app: INestApplication;
export let prisma: PrismaService;

async function initApp() {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleFixture.createNestApplication();

	app.use(cookieParser());
	app.useGlobalPipes(GlobalValidationPipe);

	prisma = moduleFixture.get(PrismaService);

	await app.init();

	db = new DbHelper(prisma);
}

beforeAll(async () => {
	await initApp();
});

afterAll(async () => {
	await app.close();
});

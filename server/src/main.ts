import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { envConfig } from './config/env.config';
import { setupApp } from './setup-app';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	setupApp(app);

	await app.listen(envConfig.port);
}

bootstrap();

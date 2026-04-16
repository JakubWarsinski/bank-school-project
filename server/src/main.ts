import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { envConfig } from './config/env.config';
import { GlobalValidationPipe } from './config/pipe.config';

import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.useGlobalPipes(GlobalValidationPipe);

	app.use(hpp());
	app.use(compression());

	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'"],
				imgSrc: ["'self'", 'data:'],
				connectSrc: ["'self'", 'http://localhost:5173'],
			},
		}),
	);

	app.enableCors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	await app.listen(envConfig.port);
}

bootstrap();

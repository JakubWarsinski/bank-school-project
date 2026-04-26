import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';

import { GlobalValidationPipe } from './config/pipe.config';

export function setupApp(app: INestApplication) {
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
}

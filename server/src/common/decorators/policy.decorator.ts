import {
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
	ForbiddenException,
	InternalServerErrorException,
	Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { UserRole } from '../../../prisma/generated/prisma/enums';

type RolePolicy = Record<string, Type<any>>;
type StateSource = 'body' | 'query';

export const PolicyBody = (policy: RolePolicy, state: StateSource = 'body') =>
	createParamDecorator((_, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		if (!req) {
			throw new InternalServerErrorException('Nie udało się uzyskać kontekstu żądania.');
		}

		const user = req.user;
		if (!user) {
			throw new ForbiddenException('Brak informacji o użytkowniku.');
		}

		const dto = policy[user.role as UserRole];
		if (!dto) {
			throw new BadRequestException(`Brak DTO policy dla roli: ${user.role}`);
		}

		const data = state === 'query' ? req.query : req.body;

		const instance = plainToInstance(dto, data, {
			enableImplicitConversion: true,
		});

		const errors = validateSync(instance, {
			whitelist: true,
			forbidNonWhitelisted: true,
			stopAtFirstError: true,
		});

		if (errors.length > 0) {
			throw new BadRequestException(errors.flatMap((e) => Object.values(e.constraints ?? {})));
		}

		return instance;
	})();

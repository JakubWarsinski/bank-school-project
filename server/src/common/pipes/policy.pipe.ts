import { Injectable, PipeTransform, Scope, Inject, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

type RoleDtoPolicy = Record<string, any>;

@Injectable({ scope: Scope.REQUEST })
export class RoleDtoPipe implements PipeTransform {
	constructor(
		@Inject(REQUEST) private readonly req: any,
		private readonly policy: RoleDtoPolicy,
	) {}

	transform(value: any) {
		const role = this.req.user?.role;

		const dto = this.policy[role];

		if (!dto) {
			throw new BadRequestException(`No DTO for role ${role}`);
		}

		const instance = plainToInstance(dto, value);

		// 🔥 WAŻNE: validation NIE działa automatycznie, więc tu zostaje
		const errors = validateSync(instance, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length) {
			throw new BadRequestException(errors.flatMap((e) => Object.values(e.constraints ?? {})));
		}

		return instance;
	}
}

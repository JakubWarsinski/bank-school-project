import type { Request } from 'express';
import { envConfig } from '@/config/env.config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtData } from './access.strategy';
import { UserRole } from '@db/generated/prisma/enums';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					return req?.cookies?.[envConfig.cookie.name];
				},
			]),
			secretOrKey: envConfig.jwt.refresh,
		});
	}

	async validate(payload: any): Promise<JwtData> {
		const requiredFields = ['id', 'role', 'first_name', 'last_name'];
		const missing = requiredFields.filter((f) => payload[f] == null);

		if (missing.length) {
			throw new UnauthorizedException(`Niepoprawny token (brak pól: ${missing.join(', ')})`);
		}

		if (!Object.values(UserRole).includes(payload.role)) {
			throw new UnauthorizedException('Niepoprawna rola użytkownika.');
		}

		return {
			id: payload.id,
			role: payload.role,
			first_name: payload.first_name,
			last_name: payload.last_name,
		};
	}
}

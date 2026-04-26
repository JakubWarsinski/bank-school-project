import type { Request } from 'express';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtData } from './access.strategy';
import { AuthService } from '../auth.service';
import { envConfig } from '../../../config/env.config';
import { UserRole } from '@prisma/client';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private readonly authService: AuthService) {
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

	async validate(payload: any, req: Request): Promise<JwtData> {
		const refreshToken = req?.cookies?.[envConfig.cookie.name];

		if (!refreshToken) {
			throw new UnauthorizedException('Brak refresh tokena.');
		}

		const requiredFields = ['id', 'role', 'first_name', 'last_name'];
		const missing = requiredFields.filter((f) => payload[f] == null);

		if (missing.length) {
			throw new UnauthorizedException(`Niepoprawny token (brak pól: ${missing.join(', ')})`);
		}

		if (!Object.values(UserRole).includes(payload.role)) {
			throw new UnauthorizedException('Niepoprawna rola użytkownika.');
		}

		return this.authService.verifyToken(payload, refreshToken);
	}
}

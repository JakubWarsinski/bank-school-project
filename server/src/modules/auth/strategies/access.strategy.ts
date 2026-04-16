import { envConfig } from '@/config/env.config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '@db/generated/prisma/enums';
import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface JwtData {
	id: number;
	role: UserRole;
	first_name: string;
	last_name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor() {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: envConfig.jwt.access,
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

import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.dto';
import { envConfig } from '@/config/env.config';
import { UserService } from '../users/users.service';
import { JwtData } from './strategies/access.strategy';
import { SessionService } from '../sessions/session.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
	) {}

	async login(dto: LoginAuthDto) {
		const { email, password } = dto;

		const user = await this.userService.verifyPassword({ email }, password);

		const payload: JwtData = {
			id: user.user_id,
			role: user.role,
			first_name: user.first_name,
			last_name: user.last_name,
		};

		return await this.generateToken(payload);
	}

	async verifyToken(jwt: JwtData, refreshToken: string) {
		const session = await this.sessionService.findUnique(jwt.id);

		const isTokenValid = await argon2.verify(session.token_hash, refreshToken);

		if (!isTokenValid) {
			throw new UnauthorizedException('Podany token nie jest zgodny z przypisanym do klienta.');
		}

		if (session.expire_at <= new Date()) {
			throw new UnauthorizedException('Sesja użytkownika wygasła. Zaloguj się ponownie.');
		}

		return {
			id: jwt.id,
			role: jwt.role,
			first_name: jwt.first_name,
			last_name: jwt.last_name,
		};
	}

	async generateToken(payload: JwtData) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: envConfig.jwt.access,
				expiresIn: envConfig.jwt.accessTime,
			}),
			this.jwtService.signAsync(payload, {
				secret: envConfig.jwt.refresh,
				expiresIn: envConfig.jwt.refreshTime,
			}),
		]);

		const token_hash = await argon2.hash(refreshToken);

		const expireAt = new Date(Date.now() + envConfig.jwt.refreshTime);

		await this.sessionService.create({
			user_id: payload.id,
			expire_at: expireAt,
			token_hash,
		});

		return { user: payload, accessToken, refreshToken };
	}
}

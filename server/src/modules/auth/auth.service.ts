import crypto from 'crypto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.dto';
import { envConfig } from '@/config/env.config';
import { UserService } from '../users/users.service';
import { JwtData } from './strategies/access.strategy';
import { ClientData } from './decorators/client.decorator';
import { SessionService } from '../sessions/session.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForgotAuthDto } from './dto/forgot.dto';
import { resend } from './resend/mail';
import { ResetTokenService } from '../reset_token/reset_token.service';
import { ResetAuthDto } from './dto/reset.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
		private readonly resetTokenService: ResetTokenService,
	) {}

	async login(dto: LoginAuthDto, client: ClientData) {
		const { email, password } = dto;

		const user = await this.userService.verifyPassword({ email }, password);

		const payload: JwtData = {
			id: user.user_id,
			role: user.role,
			first_name: user.first_name,
			last_name: user.last_name,
		};

		return await this.generateToken(payload, client);
	}

	async forgot(dto: ForgotAuthDto) {
		const { email, pesel } = dto;

		const user = await this.userService.findUnique({ email, pesel });

		const resetCode = crypto.randomInt(100000, 999999).toString();

		const token_hash = await argon2.hash(resetCode);

		const expire_at = new Date(Date.now() + 15 * 60 * 1000);

		await this.resetTokenService.create({ user_id: user.user_id, token_hash, expire_at });

		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: user.email,
			subject: 'Reset hasła - StudentBank',
			html: `
				<div style="font-family: Arial, sans-serif; background: #f4f6f8; padding: 40px;">
					<div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px;">
						
						<h2 style="color: #1a237e; margin-bottom: 20px;">
							Reset hasła
						</h2>

						<p style="font-size: 15px; color: #333;">
							Otrzymaliśmy prośbę o reset hasła do Twojego konta.
						</p>

						<p style="font-size: 15px; color: #333;">
							Wprowadź poniższy kod w aplikacji, aby kontynuować:
						</p>

						<div style="
							font-size: 28px;
							letter-spacing: 6px;
							font-weight: bold;
							text-align: center;
							margin: 25px 0;
							color: #0d47a1;
						">
							${resetCode}
						</div>

						<p style="font-size: 14px; color: #666;">
							Kod jest ważny przez <strong>15 minut</strong>.
						</p>

						<hr style="margin: 30px 0;" />

						<p style="font-size: 13px; color: #999;">
							Jeśli to nie Ty wysłałeś prośbę o reset hasła, zignoruj tę wiadomość.
							W trosce o bezpieczeństwo nigdy nie udostępniaj nikomu swojego kodu.
						</p>

						<p style="font-size: 13px; color: #999;">
							© ${new Date().getFullYear()} StudentBank
						</p>
					</div>
				</div>
			`,
		});

		return 'Wysłano kod na podany e-mail';
	}

	async verifyToken(jwt: JwtData, client: ClientData, refreshToken: string) {
		const session = await this.sessionService.findUnique(jwt.id);

		const isTokenValid = await argon2.verify(session.token_hash, refreshToken);

		if (!isTokenValid) {
			throw new UnauthorizedException('Podany token nie jest zgodny z przypisanym do klienta.');
		}

		if (session.expires_at <= new Date()) {
			throw new UnauthorizedException('Sesja użytkownika wygasła. Zaloguj się ponownie.');
		}

		if (client.ip_address && session.ip_address !== client.ip_address) {
			throw new UnauthorizedException('Adres IP urządzenia nie zgadza się z zapisanym w sesji.');
		}

		if (client.user_agent && session.user_agent !== client.user_agent) {
			throw new UnauthorizedException('Przeglądarka lub wersja systemu różni się od zapisanej w sesji.');
		}

		if (session.device !== client.device) {
			throw new UnauthorizedException('Typ urządzenia różni się od zapisanego w sesji.');
		}

		return await this.generateToken(jwt, client);
	}

	private async generateToken(payload: JwtData, client: ClientData) {
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

		const expiredAt = new Date(Date.now() + envConfig.jwt.refreshTime);

		await this.sessionService.create({
			user_id: payload.id,
			expires_at: expiredAt,
			token_hash,
			...client,
		});

		return { user: payload, accessToken, refreshToken };
	}
}

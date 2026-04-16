import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { envConfig } from '@/config/env.config';
import { Cookie } from './decorators/cookie.decorator';
import { JwtData } from './strategies/access.strategy';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { SessionService } from '../sessions/session.service';
import { IsPublic } from '@/common/decorators/public.decorator';
import { clearCookies, setCookies } from './cookies/global.cookie';
import { Client, type ClientData } from './decorators/client.decorator';
import { Controller, Post, Body, Res, Get, UseGuards, HttpCode, Delete } from '@nestjs/common';
import { ForgotAuthDto } from './dto/forgot.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionService: SessionService,
	) {}

	@HttpCode(200)
	@IsPublic()
	@Post('/login')
	async login(@Client() client: ClientData, @Body() dto: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
		const { user, accessToken, refreshToken } = await this.authService.login(dto, client);

		setCookies(res, refreshToken);

		return { user, accessToken };
	}

	@HttpCode(200)
	@IsPublic()
	@Post('/forgot')
	async forgot(@Body() dto: ForgotAuthDto, @Res({ passthrough: true }) res: Response) {
		const message = await this.authService.forgot(dto);

		return message;
	}

	@UseGuards(RefreshAuthGuard)
	@IsPublic()
	@Get()
	async refresh(
		@Client() client: ClientData,
		@Jwt() jwt: JwtData,
		@Cookie(envConfig.cookie.name) token: string,
		@Res({ passthrough: true }) res: Response,
	) {
		const { user, accessToken, refreshToken } = await this.authService.verifyToken(jwt, client, token);

		setCookies(res, refreshToken);

		return { user, accessToken };
	}

	@HttpCode(204)
	@Delete()
	async logout(@Jwt() jwt: JwtData, @Res({ passthrough: true }) res: Response) {
		await this.sessionService.delete(jwt.id);

		clearCookies(res);
	}
}

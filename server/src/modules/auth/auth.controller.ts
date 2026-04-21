import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { JwtData } from './strategies/access.strategy';
import { Jwt } from '@/common/decorators/jwt.decorator';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { SessionService } from '../sessions/session.service';
import { IsPublic } from '@/common/decorators/public.decorator';
import { clearCookies, setCookies } from './cookies/global.cookie';
import { Controller, Post, Body, Res, Get, UseGuards, HttpCode, Delete } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionService: SessionService,
	) {}

	@HttpCode(200)
	@IsPublic()
	@Post('/login')
	async login(@Body() dto: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
		const { user, accessToken, refreshToken } = await this.authService.login(dto);

		setCookies(res, refreshToken);

		return { user, accessToken };
	}

	@UseGuards(RefreshAuthGuard)
	@IsPublic()
	@Get()
	async refresh(@Jwt() jwt: JwtData, @Res({ passthrough: true }) res: Response) {
		const { user, accessToken, refreshToken } = await this.authService.generateToken(jwt);

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

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RolesGuard } from '@/common/guards/role.guard';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { JwtStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { UserModule } from '../users/users.module';
import { SessionModule } from '../sessions/session.module';
import { ResetTokenModule } from '../reset_token/reset_token.module';

@Module({
	imports: [JwtModule.register({}), UserModule, SessionModule, ResetTokenModule],
	providers: [
		JwtService,
		AuthService,
		JwtStrategy,
		RefreshStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
	controllers: [AuthController],
})
export class AuthModule {}

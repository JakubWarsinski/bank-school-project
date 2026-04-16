import { JwtData } from '@/modules/auth/strategies/access.strategy';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Jwt = createParamDecorator((data: keyof JwtData | undefined, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();

	const user: JwtData = request.user;

	if (!data) {
		return user;
	}

	return user[data];
});

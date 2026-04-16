import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const Cookie = createParamDecorator((cookieName: string, ctx: ExecutionContext): string => {
	const req = ctx.switchToHttp().getRequest<Request & { cookies?: Record<string, string> }>();
	if (!req.cookies) {
		throw new BadRequestException('Brak cookies w żądaniu.');
	}

	const value = req.cookies[cookieName];

	if (!value) {
		throw new BadRequestException(`Brak cookie o nazwie "${cookieName}".`);
	}

	return value;
});

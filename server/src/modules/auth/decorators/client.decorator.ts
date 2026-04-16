import UAParser from 'ua-parser-js';
import type { Request } from 'express';
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export interface ClientData {
	ip_address?: string;
	user_agent: string;
	device?: string;
}

function getClientIp(req: Request): string {
	const forwardedFor = req.headers['x-forwarded-for'];

	if (typeof forwardedFor === 'string') {
		return forwardedFor.split(',')[0].trim();
	}

	return req.socket.remoteAddress ?? 'unknown';
}

export const Client = createParamDecorator((_data: unknown, ctx: ExecutionContext): ClientData => {
	const req = ctx.switchToHttp().getRequest<Request>();
	if (!req) {
		throw new InternalServerErrorException('Brak kontekstu żądania.');
	}

	const ip_address = getClientIp(req);

	const user_agent = req.headers['user-agent'] ?? 'unknown';

	const parser = new UAParser.UAParser(user_agent);

	const device = parser.getDevice().type ?? 'desktop';

	return { ip_address, user_agent, device };
});

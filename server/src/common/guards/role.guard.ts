import { Reflector } from '@nestjs/core';
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	InternalServerErrorException,
	ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@db/generated/prisma/enums';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles) {
			return true;
		}

		const req = context.switchToHttp().getRequest();
		if (!req) {
			throw new InternalServerErrorException('Nie udało się uzyskać kontekstu żądania.');
		}

		const user = req.user;
		if (!user) {
			throw new ForbiddenException('Brak informacji o użytkowniku.');
		}

		const hasRole = requiredRoles.includes(user.role);
		if (!hasRole) {
			throw new ForbiddenException('Brak wymaganej roli do wykonania operacji.');
		}

		return true;
	}
}

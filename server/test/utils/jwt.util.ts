import jwt from 'jsonwebtoken';
import { UserRole } from '../../prisma/generated/prisma/enums';

const ACCESS_SECRET = process.env.JWT_SHORT!;
const REFRESH_SECRET = process.env.JWT_REFRESH!;

export function generateAccessToken(id: number, role: UserRole, first_name = 'test', last_name = 'test'): string {
	const payload = { id, role, first_name, last_name };

	return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(id: number, role: UserRole, first_name = 'test', last_name = 'test'): string {
	const payload = { id, role, first_name, last_name };

	return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function generateTokens(id: number, role: UserRole, first_name = 'test', last_name = 'test') {
	return {
		accessToken: generateAccessToken(id, role, first_name, last_name),
		refreshToken: generateRefreshToken(id, role, first_name, last_name),
	};
}

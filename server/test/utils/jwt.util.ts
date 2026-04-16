import jwt from 'jsonwebtoken';
import { UserRole } from '../../prisma/generated/prisma/enums';

const ACCESS_SECRET = process.env.JWT_SHORT!;
const REFRESH_SECRET = process.env.JWT_REFRESH!;

export function generateAccessToken(user_id: string, role: UserRole, first_name = 'test', last_name = 'test'): string {
	const payload = { user_id, role, first_name, last_name };

	return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(user_id: string, role: UserRole, first_name = 'test', last_name = 'test'): string {
	const payload = { user_id, role, first_name, last_name };

	return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function generateTokens(user_id: string, role: UserRole, first_name = 'test', last_name = 'test') {
	return {
		accessToken: generateAccessToken(user_id, role, first_name, last_name),
		refreshToken: generateRefreshToken(user_id, role, first_name, last_name),
	};
}

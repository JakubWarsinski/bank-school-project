import { Response } from 'express';
import { envConfig } from '@/config/env.config';

const name = envConfig.cookie.name;
const maxAge = envConfig.jwt.refreshTime;

export const setCookies = (res: Response, refreshToken: string) => {
	res.cookie(name, refreshToken, {
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		maxAge,
		path: 'auth',
	});
};

export const clearCookies = (res: Response) => {
	res.clearCookie(name, {
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		maxAge,
		path: 'auth',
	});
};

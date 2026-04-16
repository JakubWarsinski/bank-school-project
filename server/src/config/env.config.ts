export const envConfig = {
	port: Number(process.env.PORT!),
	resend: process.env.RESEND_KEY!,
	cookie: {
		name: process.env.COOKIE_NAME!,
	},
	jwt: {
		access: process.env.JWT_SHORT!,
		refresh: process.env.JWT_REFRESH!,
		accessTime: Number(process.env.JWT_ACCESS_TIME!),
		refreshTime: Number(process.env.JWT_REFRESH_TIME!),
	},
};

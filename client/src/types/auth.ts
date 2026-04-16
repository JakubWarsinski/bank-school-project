export interface PostAuthDto {
	email: string;
	password: string;
}

export interface AuthUser {
	id: string;
	role: string;
	first_name: string;
	last_name: string;
}

export interface AuthResponse {
	user: AuthUser;
	accessToken: string;
}

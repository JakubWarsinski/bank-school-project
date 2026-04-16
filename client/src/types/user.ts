export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'CLIENT';

export interface User {
	role: UserRole;
	first_name: string;
	last_name: string;
	user_id: number;
	code: string;
	pesel: string;
	email: string;
	date_of_birth: string;
	phone_number: string;
	street: string;
	city: string;
	postal_code: string;
	is_active: boolean;
	id_card_number: string;
	id_card_issue: Date;
	id_card_expiry: Date;
	profession: string;
	monthly_net_income: string;
	main_income_sources: string;
	created_at: Date;
	updated_at: Date;
}

export interface GetUserDto {
	cursor: number;
	limit: number;
	role?: UserRole;
	first_name?: string;
	last_name?: string;
	user_id?: number;
	date_of_birth?: string;
	phone_number?: string;
	street?: string;
	city?: string;
	postal_code?: string;
	is_active?: boolean;
	id_card_number: string;
	id_card_issue: Date;
	id_card_expiry: Date;
	profession: string;
	monthly_net_income: string;
	main_income_sources: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface GetUserResponse {
	users: User[];
	cursor: number;
}

export interface PostUserDto {
	role: UserRole;
	first_name: string;
	last_name: string;
	pesel: string;
	email: string;
	date_of_birth: string;
	phone_number: string;
	street: string;
	city: string;
	postal_code: string;
	is_active: boolean;
	password: string;
	id_card_number: string;
	id_card_issue: Date;
	id_card_expiry: Date;
	profession: string;
	monthly_net_income: string;
	main_income_sources: string;
}

export interface PatchUserDto {
	role?: UserRole;
	first_name?: string;
	last_name?: string;
	pesel?: string;
	email?: string;
	date_of_birth?: string;
	phone_number?: string;
	street?: string;
	city?: string;
	postal_code?: string;
	is_active?: boolean;
	password?: string;
	id_card_number?: string;
	id_card_issue?: Date;
	id_card_expiry?: Date;
	profession?: string;
	monthly_net_income?: string;
	main_income_sources?: string;
}

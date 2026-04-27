export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'CLIENT';

export interface User {
	readonly user_id: number;
	readonly code: string;
	readonly role: UserRole;
	readonly first_name: string;
	readonly last_name: string;
	readonly date_of_birth: string;
	readonly pesel: string;
	readonly email: string;
	readonly phone_number: string;
	readonly street: string;
	readonly city: string;
	readonly postal_code: string;
	readonly password: string;
	readonly is_active: boolean;
	readonly id_card_number: string;
	readonly id_card_issue: string;
	readonly id_card_expiry: string;
	readonly profession: string;
	readonly monthly_net_income: string;
	readonly main_income_sources: string;
	readonly updated_at: Date;
	readonly created_at: Date;
}

export interface GetUserDto {
	cursor?: number;
	limit?: number;
	code?: string;
	role?: UserRole;
	first_name?: string;
	last_name?: string;
	date_of_birth?: string;
	pesel?: string;
	email?: string;
	phone_number?: string;
	street?: string;
	city?: string;
	postal_code?: string;
	is_active?: boolean;
	id_card_number?: string;
	updated_at?: Date;
	updated_at_gte?: Date;
	updated_at_lte?: Date;
	created_at?: Date;
	created_at_gte?: Date;
	created_at_lte?: Date;
}

export interface GetUserResponse {
	readonly items: User[];
	readonly cursor: number;
}

export interface PostUserDto {
	role: UserRole;
	first_name: string;
	last_name: string;
	date_of_birth: string;
	pesel: string;
	email: string;
	phone_number: string;
	street: string;
	city: string;
	postal_code: string;
	id_card_number: string;
	id_card_issue: string;
	id_card_expiry: string;
	profession: string;
	monthly_net_income: string;
	main_income_sources: string;
}

export interface PatchUserDto {
	role?: UserRole;
	first_name?: string;
	last_name?: string;
	date_of_birth?: string;
	pesel?: string;
	email?: string;
	phone_number?: string;
	street?: string;
	city?: string;
	postal_code?: string;
	password?: string;
	is_active?: boolean;
	id_card_number?: string;
	id_card_issue?: string;
	id_card_expiry?: string;
	profession?: string;
	monthly_net_income?: string;
	main_income_sources?: string;
}

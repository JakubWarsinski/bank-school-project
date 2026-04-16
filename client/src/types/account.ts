export type AccountStatus = 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | 'CLOSED';

export type AccountRole = 'OWNER' | 'CO_OWNER';

export interface Account {
	currency: string;
	account_id: number;
	iban: string;
	name: string;
	status: AccountStatus;
	current_balance: number;
	available_balance: number;
	blocked_amount: number;
	daily_transfer_limit: number;
	closed_at: Date | null;
	closed_reason: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface GetAccountDto {
	cursor?: number;
	limit?: number;
	iban?: string;
	status?: AccountStatus;
	closed_at?: Date | null;
	current_balance?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface GetAccountResponse {
	accounts: Account[];
	cursor: number;
}

export interface PostAccountDto {
	currency: string;
	user_id: number;
}

export interface PatchAccountDto {
	currency?: string;
	name?: string;
	status?: AccountStatus;
	current_balance?: number;
	available_balance?: number;
	blocked_amount?: number;
	daily_transfer_limit?: number;
	closed_at?: Date | null;
	closed_reason?: string | null;
}

export interface AddAccountDto {
	user_id: string;
	role: AccountRole;
}

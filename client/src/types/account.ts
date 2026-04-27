export type AccountStatus = 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | 'CLOSED';

export type AccountRole = 'OWNER' | 'CO_OWNER';

export interface Account {
	readonly account_id: number;
	readonly iban: string;
	readonly currency: string;
	readonly name: string;
	readonly status: AccountStatus;
	readonly current_balance: number;
	readonly available_balance: number;
	readonly blocked_amount: number;
	readonly daily_transfer_limit: number;
	readonly closed_at: Date | null;
	readonly closed_reason: string | null;
	readonly created_at: Date;
	readonly updated_at: Date;
}

export interface GetAccountDto {
	cursor?: number;
	limit?: number;
	iban?: string;
	status?: AccountStatus;
	current_balance?: number;
	current_balance_gte?: Number;
	current_balance_lte?: Number;
	closed_at?: Date;
	closed_at_gte?: Date;
	closed_at_lte?: Date;
	created_at?: Date;
	created_at_gte?: Date;
	created_at_lte?: Date;
	updated_at?: Date;
	updated_at_gte?: Date;
	updated_at_lte?: Date;
}

export interface GetAccountResponse {
	readonly items: Account[];
	readonly cursor: number;
}

export interface PostAccountDto {
	currency: string;
	user_id: number;
}

export interface PatchAccountDto {
	currency?: string;
	name?: string;
	status?: AccountStatus;
	daily_transfer_limit?: number;
	blocked_amount?: number;
	closed_at?: Date;
	closed_reason?: string;
}

export interface AddAccountDto {
	user_id: number;
	role: AccountRole;
}

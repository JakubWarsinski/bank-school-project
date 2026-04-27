export type CardStatus = 'ACTIVE' | 'BLOCKED_BY_USER' | 'BLOCKED_BY_BANK' | 'STOLEN' | 'LOST' | 'EXPIRED' | 'CLOSED';

export interface Card {
	readonly card_id: number;
	readonly account_id: number;
	readonly name: string;
	readonly status: CardStatus;
	readonly card_number: string;
	readonly last_digits: string;
	readonly cvv: string;
	readonly pin: string;
	readonly expiry_month: number;
	readonly expiry_year: number;
	readonly payment_limit: number;
	readonly withdraw_limit: number;
	readonly daily_withdraw_limit: number;
	readonly daily_payment_limit: number;
	readonly blocked_at: Date | null;
	readonly blocked_reason: string | null;
	readonly created_at: Date;
	readonly updated_at: Date;
}

export interface GetCardDto {
	cursor?: number;
	limit?: number;
	status?: CardStatus;
	expiry_month?: number;
	expiry_month_gte?: number;
	expiry_month_lte?: number;
	expiry_year?: number;
	expiry_year_gte?: number;
	expiry_year_lte?: number;
	blocked_at?: Date;
	blocked_at_gte?: Date;
	blocked_at_lte?: Date;
	created_at?: Date;
	created_at_gte?: Date;
	created_at_lte?: Date;
	updated_at?: Date;
	updated_at_gte?: Date;
	updated_at_lte?: Date;
}

export interface GetCardResponse {
	readonly items: Card[];
	readonly cursor: number;
}

export interface PostCardDto {
	account_id: number;
	payment_limit: number;
	withdraw_limit: number;
}
export interface PatchCardDto {
	name?: string;
	status?: CardStatus;
	pin?: string;
	daily_withdraw_limit?: number;
	daily_payment_limit?: number;
	blocked_at?: Date;
	blocked_reason?: string;
}

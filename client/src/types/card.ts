export type CardStatus = 'ACTIVE' | 'BLOCKED_BY_USER' | 'BLOCKED_BY_BANK' | 'STOLEN' | 'LOST' | 'EXPIRED' | 'CLOSED';

export interface Card {
	status: CardStatus;
	expiry_month: number;
	expiry_year: number;
	payment_limit: number;
	withdraw_limit: number;
	blocked_at: Date | null;
	created_at: Date;
	updated_at: Date;
	card_id: number;
	account_id: number;
	name: string;
	last_digits: string;
	daily_withdraw_limit: number;
	daily_payment_limit: number;
	blocked_reason: string | null;
}

export interface GetCardDto {
	cursor: number;
	limit: number;
	status?: CardStatus;
	expiry_month?: number;
	expiry_year?: number;
	payment_limit?: number;
	withdraw_limit?: number;
	blocked_at?: Date | null;
	created_at?: Date;
	updated_at?: Date;
}

export interface GetCardResponse {
	cards: Card[];
	cursor: number;
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
	payment_limit?: number;
	withdraw_limit?: number;
	blocked_at?: Date | null;
	blocked_reason?: string | null;
}

export type TransactionType = 'INTERNAL_TRANSFER' | 'CARD_PAYMENT' | 'CARD_WITHDRAWAL' | 'ADJUSTMENT' | 'REVERSAL';

export type StatusType = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'BLOCKED' | 'REFUNDED';

export interface Transaction {
	readonly transaction_id: number;
	readonly code: string;
	readonly status: StatusType;
	readonly type: TransactionType;
	readonly sender_id: number;
	readonly receiver_id: number;
	readonly title: string;
	readonly description: string;
	readonly amount: number;
	readonly currency: string;
	readonly booking_date: Date;
	readonly created_at: Date;
	readonly updated_at: Date;
}

export interface GetTransactionDto {
	cursor?: number;
	limit?: number;
	code?: string;
	status?: StatusType;
	type?: TransactionType;
	amount?: number;
	amount_gte?: number;
	amount_lte?: number;
	title?: string;
	currency?: string;
	booking_date?: Date;
	booking_date_gte?: Date;
	booking_date_lte?: Date;
	created_at?: Date;
	created_at_gte?: Date;
	created_at_lte?: Date;
	updated_at?: Date;
	updated_at_gte?: Date;
	updated_at_lte?: Date;
}

export interface GetTransactionResponse {
	readonly items: Transaction[];
	readonly cursor: number;
}

export interface PostTransactionDto {
	type: TransactionType;
	title: string;
	description: string;
	amount: number;
	currency: string;
	sender_iban: string;
	receiver_iban: string;
}

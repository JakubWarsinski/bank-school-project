export type TransactionType = 'INTERNAL_TRANSFER' | 'CARD_PAYMENT' | 'CARD_WITHDRAWAL' | 'ADJUSTMENT' | 'REVERSAL';

export type StatusType = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'BLOCKED' | 'REFUNDED';

export interface Transaction {
	transaction_id: number;
	code: string;
	status: StatusType;
	type: TransactionType;
	sender_id: number;
	receiver_id: number;
	title: string;
	description: string;
	amount: number;
	currency: string;
	booking_date: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface GetTransactionDto {
	cursor?: number;
	limit?: number;
	code?: string;
	title?: string;
	status?: StatusType;
	type?: TransactionType;
	amount_gte?: number;
	amount_lte?: number;
	amount?: number;
	currency?: string;
	booking_date?: Date | null;
	created_at?: Date;
	updated_at?: Date;
	created_at_gte?: Date;
	created_at_lte?: Date;
}

export interface GetTransactionResponse {
	items: Transaction[];
	cursor: number;
}

export interface PostTransactionDto {
	type: TransactionType;
	title: string;
	description: string;
	amount: number;
	currency: string;
}

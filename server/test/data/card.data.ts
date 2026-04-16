export const CardData = {
	name: 'Card Name',
	card_number_hash: 'CARD HASH',
	last_digits: '1234',
	cvv_hash: 'CVV HASH',
	pin_hash: 'PIN HASH',
	expiry_date: new Date(),
	limit: 0.0,
	daily_withdraw_limit: 0.0,
	daily_payment_limit: 0.0,
	is_active: true,
	created_at: new Date(),
	updated_at: new Date(),
};

export const CreateCardData = {
	limit: 0.0,
};

export const InvalidCardData = {
	limit: ['', 'A'],
	account_id: ['', 'A', 123],
};

export const UpdateCardByUserData = {
	name: 'New card Name',
	pin: '1234',
	daily_withdraw_limit: 100.0,
	daily_payment_limit: 100.0,
};

export const UpdateCardByAdminData = {
	pin: '1234',
	expiry_date: new Date(),
	limit: 0.0,
	is_active: true,
};

export const SkipCardData = ['card_number_hash', 'cvv_hash', 'pin_hash'];

export const SkipCardQuery = [
	'card_id',
	'card_number_hash',
	'last_digits',
	'cvv_hash',
	'pin_hash',
	'daily_withdraw_limit',
	'daily_payment_limit',
];

export const AccountData = {
	currency: 'PLN',
	name: 'Account',
	balance: 500,
	available_balance: 500,
	blocked_amount: 100,
	limit: 5000,
	is_active: true,
	closed_at: new Date(),
};

export const CreateAccountData = {
	currency: 'PLN',
	user_id: '1',
};

export const InvalidAccountData = {
	currency: ['', 'A', 123, 'a'.repeat(4)],
	user_id: ['', 'A', 123],
};

export const UpdateAccountByUserData = {
	currency: 'DOL',
	name: 'New Account',
};

export const UpdateAccountByAdminData = {
	currency: 'DOL',
	blocked_amount: 100,
	limit: 100,
	is_active: false,
	closed_at: new Date(),
};

export const SkipAccountQuery = ['account_id', 'name', 'blocked_amount'];

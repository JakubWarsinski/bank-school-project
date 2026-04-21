import { AccountRole } from '../generated/prisma/enums';

export const generateUserAccount = (user_id: number, account_id: number, role?: AccountRole) => {
	return {
		user_id,
		account_id,
		role,
	};
};

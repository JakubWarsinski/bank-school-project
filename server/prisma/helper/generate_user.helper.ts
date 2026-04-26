import * as argon2 from 'argon2';
import { UserRole } from '../generated/prisma/enums';
import {
	generateRandomDate,
	generateRandomDateString,
	generateRandomDigits,
	pickRandom,
} from './random_generator.helper';
import {
	userCities,
	userFirstNames,
	userIncomes,
	userIncomeSources,
	userLastNames,
	userProfessions,
	userStreets,
} from '../data/user.data';

export const generateUser = async (role?: UserRole, email?: string, password?: string, is_active?: boolean) => {
	return {
		code: `USER${generateRandomDigits(12)}`,
		role: !role ? UserRole.CLIENT : role,
		first_name: pickRandom(userFirstNames),
		last_name: pickRandom(userLastNames),
		date_of_birth: generateRandomDateString(new Date(1960, 0, 1), new Date(2005, 11, 31)),
		pesel: generateRandomDigits(11),
		email: !email ? `test${generateRandomDigits(4)}@gmail.com` : email,
		phone_number: generateRandomDigits(9),
		street: `${pickRandom(userStreets)} ${Math.floor(Math.random() * 150 + 1)}`,
		city: pickRandom(userCities),
		postal_code: `${generateRandomDigits(2)}-${generateRandomDigits(3)}`,
		password_hash: await argon2.hash(!password ? 'Admin1/!' : password),
		is_active: !is_active ? true : is_active,
		id_card_number: `ABA${generateRandomDigits(6)}`,
		id_card_issue: generateRandomDateString(new Date(2015, 0, 1), new Date(2023, 11, 31)),
		id_card_expiry: generateRandomDateString(new Date(2023, 12, 31), new Date(2020, 11, 31)),
		profession: pickRandom(userProfessions),
		monthly_net_income: pickRandom(userIncomes),
		main_income_sources: pickRandom(userIncomeSources),
		created_at: generateRandomDate(new Date(2015, 0, 1), new Date(2023, 11, 31)),
		updated_at: generateRandomDate(new Date(2015, 0, 1), new Date(2023, 11, 31)),
	};
};

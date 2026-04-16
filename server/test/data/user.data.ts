import { UserRole } from '../../prisma/generated/prisma/enums';

export const UserData = {
	first_name: 'Name',
	last_name: 'Surname',
	phone_number: '111111111',
	date_of_birth: '1990-05-12',
	street: 'Street',
	city: 'City',
	postal_code: '12-123',
	is_active: true,
};

export function CreateUserData(role?: UserRole) {
	const email = `${Math.floor(Math.random() * 10 ** 8)}@test.pl`;
	const pesel = String(Math.floor(Math.random() * 10 ** 11)).padStart(11, '0');

	const data = {
		first_name: 'Name',
		last_name: 'Surname',
		email,
		phone_number: '111111111',
		date_of_birth: '1990-05-12',
		password: 'TestPassword123!',
		street: 'Street',
		city: 'City',
		postal_code: '12-123',
		pesel,
	};

	if (role) {
		data['role'] = role;
	}

	return data;
}

export const InvalidUserData = {
	first_name: ['', 'A', 123, 'a'.repeat(51)],
	last_name: ['', 'A', 123],
	email: ['', 'aaa', 'bad@', '@domain.pl', 22],
	phone_number: ['', 'abc', '1', '999', {}],
	date_of_birth: ['', '01-01-1990', '1990/01/01', 'abc', 123],
	password: ['', 'a', '123', 'TestPassword', 123],
	pesel: ['', '1', 'abc', '123', 123],
	postal_code: ['', '11111', 'AA-AAA', '1'],
	role: ['', '1', 123],
};

export const UpdateUserByUserData = {
	email: 'newMail@1.pl',
	phone_number: '222222222',
	password: 'NewPassword123!',
};

export const UpdateUserByAdminData = {
	first_name: 'New Name',
	last_name: 'New Surname',
	email: 'newMail@1.pl',
	phone_number: '222222222',
	date_of_birth: '2000-05-12',
	password: 'NewPassword123!',
	street: 'New Street',
	city: 'New City',
	postal_code: '22-222',
	pesel: '22222222222',
	role: UserRole.EMPLOYEE,
};

export const UpdateUserByEmployeeData = {
	first_name: 'New Name',
	last_name: 'New Surname',
	email: 'newMail@1.pl',
	phone_number: '222222222',
	date_of_birth: '2000-05-12',
	password: 'NewPassword123!',
	street: 'New Street',
	city: 'New City',
	postal_code: '22-222',
	pesel: '22222222222',
};

export const SkipUserQuery = ['password_hash', 'user_id'];

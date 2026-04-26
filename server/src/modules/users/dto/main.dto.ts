import { Type } from 'class-transformer';
import {
	IsString,
	IsEmail,
	IsDate,
	IsBoolean,
	Length,
	Matches,
	IsEnum,
	IsDateString,
	Min,
	IsNumber,
	MaxLength,
} from 'class-validator';
import { UserRole } from '../../../../prisma/generated/prisma/enums';

export class UserDto {
	@Min(0, { message: 'ID użytkownika nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
	readonly user_id!: number;

	@Length(16, 16, { message: 'Kod użytkownika musi mieć 16 znaków.' })
	@IsString({ message: 'Kod użytkownika musi być tekstem.' })
	readonly code!: string;

	@IsEnum(UserRole, { message: 'Rola użytkownika musi być jedną z dozwolonych wartości.' })
	readonly role!: UserRole;

	@Length(2, 50, { message: 'Imię musi mieć od 2 do 50 znaków.' })
	@Matches(/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+$/, {
		message: 'Imię może zawierać tylko litery.',
	})
	@IsString({ message: 'Imię musi być tekstem.' })
	readonly first_name!: string;

	@Length(2, 50, { message: 'Nazwisko musi mieć od 2 do 50 znaków.' })
	@Matches(/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+$/, {
		message: 'Nazwisko może zawierać tylko litery.',
	})
	@IsString({ message: 'Nazwisko musi być tekstem.' })
	readonly last_name!: string;

	@IsDateString({}, { message: 'Data urodzenia musi być poprawną datą.' })
	readonly date_of_birth!: string;

	@Matches(/^[0-9]{11}$/, { message: 'PESEL musi zawierać dokładnie 11 cyfr.' })
	@IsString({ message: 'PESEL musi być tekstem.' })
	readonly pesel!: string;

	@IsEmail({}, { message: 'Adres e-mail musi być poprawny.' })
	@IsString({ message: 'Adres e-mail musi być tekstem.' })
	readonly email!: string;

	@Matches(/^[0-9]{9,11}$/, { message: 'Numer telefonu musi zawierać od 9 do 11 cyfr.' })
	@IsString({ message: 'Numer telefonu musi być tekstem.' })
	readonly phone_number!: string;

	@Length(2, 80, { message: 'Ulica musi mieć od 2 do 80 znaków.' })
	@Matches(/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .\/\-]+$/, {
		message: 'Ulica zawiera niedozwolone znaki.',
	})
	@IsString({ message: 'Ulica musi być tekstem.' })
	readonly street!: string;

	@Length(2, 80, { message: 'Miasto musi mieć od 2 do 80 znaków.' })
	@Matches(/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]+$/, {
		message: 'Miasto może zawierać tylko litery.',
	})
	@IsString({ message: 'Miasto musi być tekstem.' })
	readonly city!: string;

	@Matches(/^[0-9]{2}-[0-9]{3}$/, { message: 'Kod pocztowy musi być w formacie XX-XXX.' })
	@IsString({ message: 'Kod pocztowy musi być tekstem.' })
	readonly postal_code!: string;

	@IsString({ message: 'Hasło musi być tekstem.' })
	readonly password!: string;

	@IsBoolean({ message: 'Aktywacja musi być wartością logiczną (true/false).' })
	readonly is_active!: boolean;

	@MaxLength(20, { message: 'Numer dowodu nie może przekraczać 20 znaków.' })
	@Matches(/^[A-Z]{3}[0-9]{6}$/, {
		message: 'Niepoprawny format numeru dowodu.',
	})
	@IsString({ message: 'Numer dowodu osobistego musi być tekstem.' })
	readonly id_card_number?: string;

	@IsDateString({}, { message: 'Data wydania dowodu musi być poprawną datą.' })
	readonly id_card_issue?: string;

	@IsDateString({}, { message: 'Data ważności dowodu musi być poprawną datą.' })
	readonly id_card_expiry?: string;

	@Matches(/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .\/\-]+$/, {
		message: 'Sytuacja zawodowa zawiera niedozwolone znaki.',
	})
	@Length(2, 100, { message: 'Sytuacja zawodowa nie może przekraczać 100 znaków.' })
	@IsString({ message: 'Sytuacja zawodowa musi być tekstem.' })
	readonly profession?: string;

	@Matches(/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .\/\-]+$/, {
		message: 'Średni miesięczny dochód zawiera niedozwolone znaki.',
	})
	@Length(2, 50, { message: 'Średni miesięczny dochód nie może przekraczać 50 znaków.' })
	@IsString({ message: 'Średni miesięczny dochód musi być tekstem.' })
	readonly monthly_net_income?: string;

	@Matches(/^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .\/\-]+$/, {
		message: 'Główne źródła dochodu zawierają niedozwolone znaki.',
	})
	@Length(2, 200, { message: 'Główne źródła dochodu nie mogą przekraczać 200 znaków.' })
	@IsString({ message: 'Główne źródła dochodu muszą być tekstem.' })
	readonly main_income_sources?: string;

	@Type(() => Date)
	@IsDate({ message: 'Data aktualizacji musi być poprawną datą.' })
	readonly updated_at!: Date;

	@Type(() => Date)
	@IsDate({ message: 'Data utworzenia musi być poprawną datą.' })
	readonly created_at!: Date;
}

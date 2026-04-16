import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ForgotAuthDto {
	@IsEmail({}, { message: 'Podano nieprawidłowy format e-mail.' })
	@IsString({ message: 'E-mail musi być tekstem.' })
	@IsNotEmpty({ message: 'E-mail nie może być pusty.' })
	readonly email: string;

	@Matches(/^[0-9]{11}$/, { message: 'PESEL musi zawierać dokładnie 11 cyfr.' })
	@IsString({ message: 'PESEL musi być tekstem.' })
	readonly pesel: string;
}

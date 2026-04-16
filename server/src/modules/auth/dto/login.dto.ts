import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
	@IsEmail({}, { message: 'Podano nieprawidłowy format e-mail.' })
	@IsString({ message: 'E-mail musi być tekstem.' })
	@IsNotEmpty({ message: 'E-mail nie może być pusty.' })
	readonly email: string;

	@MinLength(8, { message: 'Minimalna długość hasła to 8 znaków.' })
	@IsString({ message: 'Hasło musi być tekstem.' })
	@IsNotEmpty({ message: 'Hasło nie może być puste.' })
	readonly password: string;
}

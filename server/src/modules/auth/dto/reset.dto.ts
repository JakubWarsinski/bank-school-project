import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetAuthDto {
	@MinLength(6, { message: 'Minimalna długość tokenu to 6 znaków.' })
	@IsString({ message: 'Token musi być tekstem.' })
	@IsNotEmpty({ message: 'Token nie może być pusty.' })
	readonly code!: string;

	@MinLength(8, { message: 'Minimalna długość hasła to 8 znaków.' })
	@IsString({ message: 'Hasło musi być tekstem.' })
	@IsNotEmpty({ message: 'Hasło nie może być puste.' })
	readonly password!: string;
}

import { Type } from 'class-transformer';
import { IsString, IsDate, Length, IsEnum, Min, IsNumber, MinLength } from 'class-validator';
import { NotificationType } from '../../../../prisma/generated/prisma/enums';

export class NotificationDto {
	@Min(0, { message: 'ID Powiadomienia nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID Powiadomienia musi być liczbą.' })
	readonly notification_id!: number;

	@Min(0, { message: 'ID użytkownika nie może być mniejsze niż 0.' })
	@Type(() => Number)
	@IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
	readonly user_id!: number;

	@IsEnum(NotificationType, { message: 'typ powiadomienia musi być jedną z dozwolonych wartości.' })
	readonly type!: NotificationType;

	@Length(2, 120, { message: 'Tytuł musi mieć od 2 do 120 znaków.' })
	@IsString({ message: 'Tytuł musi być tekstem.' })
	readonly title!: string;

	@MinLength(2, { message: 'Wiadomość musi mieć co namniej 2 znaki.' })
	@IsString({ message: 'Wiadomość musi być tekstem.' })
	readonly message!: string;

	@Type(() => Date)
	@IsDate({ message: 'Data utworzenia musi być poprawną datą.' })
	readonly created_at!: Date;
}

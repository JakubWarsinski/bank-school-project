import { NotificationType } from '../generated/prisma/enums';

export const notificationTitles = [
	'Nowe powiadomienie',
	'Zmiana statusu konta',
	'Bezpieczeństwo systemu',
	'Ważna informacja',
];

export const notificationMessages = [
	'Twoje dane zostały zaktualizowane.',
	'Wykryto nowe logowanie do konta.',
	'Operacja została zakończona pomyślnie.',
	'Zmiana statusu została zapisana.',
];

export const notificationTypes = Object.values(NotificationType);

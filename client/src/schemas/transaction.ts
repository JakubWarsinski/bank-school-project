import { z } from 'zod';

export const transactionSchema = z.object({
	type: z.enum(['INTERNAL_TRANSFER', 'CARD_PAYMENT', 'CARD_WITHDRAWAL', 'ADJUSTMENT', 'REVERSAL']),

	title: z.string().min(1, 'Tytuł wymagany').max(80),

	description: z.string().min(1, 'Opis wymagany').max(200),

	amount: z.coerce.number().positive('Kwota musi być > 0'),

	currency: z.string().length(3),

	receiver_iban: z.string().length(28, 'IBAN musi mieć 28 znaków').regex(/^PL/, 'IBAN musi zaczynać się od PL'),
});

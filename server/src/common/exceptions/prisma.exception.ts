import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

export function handlePrismaError(error: any): never {
	if (error instanceof PrismaClientKnownRequestError) {
		const code = error.code;
		const meta = error.meta ?? {};

		if (code === 'P2002') {
			const driverError = (meta as any)?.driverAdapterError?.cause;
			const message = driverError?.originalMessage as string | undefined;

			let field = 'nieznane pole';

			if (message) {
				const match = message.match(/"(.+?)"/);
				if (match) {
					field = match[1];
				}
			}

			throw new ConflictException(`Wartość dla pola ${field} już istnieje.`);
		}

		if (code === 'P2025') {
			throw new NotFoundException('Nie znaleziono żądanego rekordu.');
		}

		if (code === 'P2003') {
			const fields = Array.isArray(meta.field_name) ? meta.field_name.join(', ') : 'nieznane pole';
			throw new BadRequestException(`Operacja narusza ograniczenie klucza obcego dla pola ${fields}.`);
		}

		if (code === 'P2016') {
			throw new BadRequestException(`Brak wymaganej wartości w jednym z pól.`);
		}

		if (code === 'P2011') {
			throw new BadRequestException(`Nieprawidłowe użycie operatora JSON.`);
		}

		if (code === 'P2004') {
			throw new BadRequestException(`Niepoprawny typ danych w jednym z pól.`);
		}

		throw error;
	}

	throw error;
}

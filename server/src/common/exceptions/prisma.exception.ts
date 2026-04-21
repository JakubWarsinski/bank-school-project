import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { BadRequestException, ConflictException } from '@nestjs/common';

export function handlePrismaError(error: any): never {
	if (!(error instanceof PrismaClientKnownRequestError)) {
		throw error;
	}

	const code = error.code;
	const meta = error.meta ?? {};

	if (code === 'P2002') {
		let field = 'nieznane pole';

		const message = (meta as any)?.driverAdapterError?.cause?.originalMessage as string | undefined;

		if (message) {
			const match = message.match(/UNIQUE constraint failed:\s*(.+)$/i);

			if (match?.[1]) {
				field = match[1]
					.split(',')
					.map((item: string) => item.trim())
					.map((item: string) => item.split('.').pop())
					.join(', ');
			}
		}

		throw new ConflictException(`Wartość dla pola ${field} już istnieje.`);
	}

	if (code === 'P2003') {
		let field = 'nieznane pole';

		const message = (meta as any)?.driverAdapterError?.cause?.originalMessage as string | undefined;

		if (message?.includes('FOREIGN KEY')) {
			field = 'klucz obcy';
		}

		throw new BadRequestException(`Operacja narusza ograniczenie relacji dla pola ${field}.`);
	}

	if (code === 'P2004') {
		throw new BadRequestException('Operacja nie mogła zostać wykonana.');
	}

	throw error;
}

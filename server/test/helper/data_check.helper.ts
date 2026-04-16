import { Decimal } from '@prisma/client/runtime/client';
import { Response } from 'supertest';

interface DataCheckOptions {
	res: Response;
	obj: Record<string, any>;
	skip?: string[];
}

interface QueryCheckOptions {
	api: any;
	obj: Record<string, any>;
	skip?: string[];
}

export function checkData({ res, obj, skip = [] }: DataCheckOptions) {
	const rawBody = Array.isArray(res.body) ? res.body[0] : res.body;

	for (const key of Object.keys(obj)) {
		if (skip.includes(key)) continue;

		const expected = obj[key];
		const actual = rawBody[key];

		try {
			compareValues(expected, actual, key);
		} catch (err) {
			throw new Error(
				`Problem porównania wartości pola "${key}":\n` +
					`Otrzymano:   ${actual}\n` +
					`Oczekiwano:  ${expected}\n` +
					`Szczegóły:   ${err instanceof Error ? err.message : err}`
			);
		}
	}
}

function compareValues(expected: any, actual: any, key: string) {
	if (expected instanceof Date) {
		expect(actual).toEqual(expected.toISOString());
		return;
	}

	if (typeof expected === 'number') {
		expect(Number(actual)).toEqual(expected);
		return;
	}

	if (expected instanceof Decimal) {
		expect(new Decimal(actual)).toEqual(expected);
		return;
	}

	expect(actual).toEqual(expected);
}

export async function checkQuery({ api, obj, skip = [] }: QueryCheckOptions) {
	const keys = Object.keys(obj).filter((key) => !skip.includes(key));

	const promises = keys.map(async (key) => {
		const originalValue = obj[key];

		const normalizedValue =
			originalValue instanceof Date
				? originalValue.toISOString()
				: originalValue instanceof Decimal
				? originalValue.toString()
				: originalValue;

		const res = await api.query({ [key]: normalizedValue });

		if (res.status !== 200) {
			throw new Error(
				`Zapytanie dla pola "${key}" zwróciło status ${res.status}\n` + `Body: ${JSON.stringify(res.body, null, 2)}`
			);
		}

		const body = res.body;

		if (!body) {
			throw new Error(`API zwróciło pustą odpowiedź dla klucza "${key}".`);
		}

		if (Array.isArray(body)) {
			if (body.length === 0) {
				throw new Error(`API zwróciło pustą tablicę dla "${key}".`);
			}

			const match = body.some((item) => {
				return item && item[key] !== undefined;
			});

			if (!match) {
				throw new Error(
					`API zwróciło tablicę, ale żaden obiekt nie zawiera klucza "${key}".\n` +
						`Body: ${JSON.stringify(body, null, 2)}`
				);
			}

			return;
		}

		if (body[key] === undefined) {
			throw new Error(`Odpowiedź z API nie zawiera klucza "${key}".\n` + `Body: ${JSON.stringify(body, null, 2)}`);
		}
	});

	await Promise.all(promises);
}

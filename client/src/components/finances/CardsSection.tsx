import { Card } from '@/types/card';
import { CardItem } from './CardItem';

export function CardsSection({ cards }: { cards: Card[] }) {
	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-semibold'>Karty</h1>

			{cards.map((card) => (
				<CardItem key={card.card_id} card={card} />
			))}
		</div>
	);
}

import { ReactNode, useEffect } from 'react';

interface PopupProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description?: string;
	children: ReactNode;
	size?: 'sm' | 'md' | 'lg';
}

export default function Popup({ isOpen, onClose, title, description, children, size = 'md' }: PopupProps) {
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const sizes = {
		sm: 'max-w-md',
		md: 'max-w-xl',
		lg: 'max-w-2xl',
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			{/* backdrop */}
			<div onClick={onClose} className='absolute inset-0 bg-black/50 backdrop-blur-sm' />

			{/* modal */}
			<div
				className={`relative w-full ${sizes[size]} rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200`}
			>
				{/* header */}
				<div className='p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800'>
					<div className='flex items-start justify-between gap-4'>
						<div>
							<h2 className='text-xl font-semibold text-zinc-900 dark:text-white'>{title}</h2>

							{description && (
								<p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>{description}</p>
							)}
						</div>

						<button
							onClick={onClose}
							className='w-9 h-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-500'
						>
							✕
						</button>
					</div>
				</div>

				{/* body */}
				<div className='p-6 space-y-4'>{children}</div>
			</div>
		</div>
	);
}

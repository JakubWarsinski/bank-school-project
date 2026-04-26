export const ProfileAgreements = () => {
	return (
		<div className='max-w-5xl mx-auto p-6'>
			<section className='space-y-4'>
				<h2 className='text-xl font-semibold text-zinc-900 dark:text-white'>Prywatność i zgody</h2>

				<div className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900'>
					<div className='flex items-center gap-4 mb-3'>
						<span className='font-medium text-zinc-900 dark:text-white'>Zgody marketingowe</span>

						<div className='flex-1 h-px bg-zinc-200 dark:bg-zinc-700' />

						<button className='text-sm font-medium text-blue-600 hover:underline'>Edytuj</button>
					</div>

					<p className='text-sm leading-6 text-zinc-600 dark:text-zinc-300'>
						Zarządzaj zgodami dotyczącymi kontaktu marketingowego, ofert, personalizowanych propozycji oraz
						komunikacji telefonicznej, e-mailowej i SMS.
					</p>
				</div>
			</section>
		</div>
	);
};

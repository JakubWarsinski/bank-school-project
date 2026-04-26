export const ProfileSecurity = () => {
	return (
		<div className='max-w-5xl mx-auto p-6'>
			<section className='space-y-4'>
				<h2 className='text-xl font-semibold text-zinc-900 dark:text-white'>Bezpieczeństwo i logowanie</h2>

				<div className='grid gap-4'>
					{[
						{
							title: 'Hasło i sposób logowania',
							desc: 'Zmień swoje hasło oraz metodę logowania do serwisu.',
						},
						{
							title: 'Sposób autoryzacji',
							desc: 'Ustaw wygodną metodę potwierdzania operacji i transakcji.',
						},
						{
							title: 'Hasło do dokumentów PDF',
							desc: 'Sprawdź lub zmień hasło do dokumentów PDF otrzymanych od banku.',
							badge: 'Nieaktywne',
						},
						{
							title: 'Numer telefonu do kodów SMS',
							desc: 'Zmień numer telefonu używany do kodów SMS i autoryzacji.',
						},
						{
							title: 'Własny login',
							desc: 'Ustaw prosty alias, dzięki któremu szybciej zalogujesz się do aplikacji.',
						},
					].map((item, index) => (
						<div
							key={index}
							className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900'
						>
							<div className='flex items-center gap-3 mb-3'>
								<div className='flex items-center gap-2 flex-wrap'>
									<span className='font-medium text-zinc-900 dark:text-white'>{item.title}</span>

									{item.badge && (
										<span className='px-2 py-0.5 text-xs rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'>
											{item.badge}
										</span>
									)}
								</div>

								<div className='flex-1 h-px bg-zinc-200 dark:bg-zinc-700' />

								<button className='text-sm font-medium text-blue-600 hover:underline'>Edytuj</button>
							</div>

							<p className='text-sm leading-6 text-zinc-600 dark:text-zinc-300'>{item.desc}</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

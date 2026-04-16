export const ProfileSecurity = () => {
	return (
		<div className='profile'>
			<div className='profile-card'>
				<div className='profile-card-header'>
					<span className='profile-card-title'>Hasło i sposób logowania</span>
					<div className='profile-divider'></div>
					<button className='profile-edit'>Edytuj</button>
				</div>

				<span className='profile-label'>Zmień swoje hasło i metodę logowania</span>
			</div>

			<div className='profile-card'>
				<div className='profile-card-header'>
					<span className='profile-card-title'>Sposób autoryzacji</span>
					<div className='profile-divider'></div>
					<button className='profile-edit'>Edytuj</button>
				</div>

				<span className='profile-label'>Ustaw wygodną metodę autoryzacji operacji</span>
			</div>

			<div className='profile-card'>
				<div className='profile-card-header'>
					<span className='profile-card-title'>Hasło do dokumentów PDF NIEAKTYWNE | Edytuj</span>
					<div className='profile-divider'></div>
					<button className='profile-edit'>Edytuj</button>
				</div>

				<span className='profile-label'>Sprawdź lub zmień hasło do dokumentów PDF otrzymanych od banku.</span>
			</div>

			<div className='profile-card'>
				<div className='profile-card-header'>
					<span className='profile-card-title'>Numer telefonu komórkowego do kodów SMS</span>
					<div className='profile-divider'></div>
					<button className='profile-edit'>Edytuj</button>
				</div>

				<span className='profile-label'>
					Zmień numer telefonu komórkowego, na który będziemy Ci wysyłać kody SMS do autoryzacji. Ten numer
					telefonu jest używany na wszystkich Twoich profilach.
				</span>
			</div>

			<div className='profile-card'>
				<div className='profile-card-header'>
					<span className='profile-card-title'>Własny login</span>
					<div className='profile-divider'></div>
					<button className='profile-edit'>Edytuj</button>
				</div>

				<span className='profile-label'>
					Ustaw własny, łatwy do zapamiętania login (alias), dzięki któremu zalogujesz się do aplikacji
				</span>
			</div>
		</div>
	);
};

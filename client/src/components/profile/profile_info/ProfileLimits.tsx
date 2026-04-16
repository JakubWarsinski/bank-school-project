import { Loading } from '@/components/loading/Loading';
import { User } from '@/types/user';

export const ProfileLimits = ({ user }: { user: User | null }) => {
	return (
		<div className='profile'>
			<span className='profile-title'>Bankowość internetowa</span>

			<div className='profile-card'>
				<div className='profile-card-header'>
					<span className='profile-card-title'>Limit dzienny</span>
					<div className='profile-divider'></div>
					<button className='profile-edit'>Edytuj</button>
				</div>

				<span className='profile-label'>{!user ? <Loading /> : user.city}</span>
			</div>

			<div className='profile-card'>
				<div className='profile-card-header'>
					<span className='profile-card-title'>Limit miesięczny</span>
					<div className='profile-divider'></div>
					<button className='profile-edit'>Edytuj</button>
				</div>

				<span className='profile-label'>{!user ? <Loading /> : user.city}</span>
			</div>
		</div>
	);
};

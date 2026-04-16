import { ReactNode } from 'react';
import '@/assets/css/profile_section.css';

interface IconProps {
	size?: number;
	color?: string;
}

interface Props {
	id: string;
	title: string;
	description?: string;
	icon?: React.ComponentType<IconProps>;
	children: ReactNode;
	isOpen: boolean;
	onToggle: (id: string) => void;
}

export const ProfileSection = ({ id, title, description, icon, children, isOpen, onToggle }: Props) => {
	const Icon = icon;

	return (
		<div className='profile-section'>
			<button className='profile-section-header' onClick={() => onToggle(id)}>
				<div className='profile-section-left'>
					{Icon && (
						<div className='profile-section-icon'>
							<Icon size={20} color='#333' />
						</div>
					)}

					<div className='profile-section-info'>
						<div className='profile-section-title'>{title}</div>
						{description && <div className='profile-section-desc'>{description}</div>}
					</div>
				</div>

				<div className={`profile-section-arrow ${isOpen ? 'open' : ''}`}>▼</div>
			</button>

			{isOpen && <div className='profile-section-content'>{children}</div>}
		</div>
	);
};

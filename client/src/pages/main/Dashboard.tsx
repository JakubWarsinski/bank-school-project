import { Header } from '@/components/header/Header';
import React from 'react';

const Dashboard: React.FC = () => {
	return (
		<div>
			<Header />

			<main style={{ padding: '20px' }}>
				<h1>Dashboard</h1>
				<p>To jest główna część panelu.</p>
			</main>
		</div>
	);
};

export default Dashboard;

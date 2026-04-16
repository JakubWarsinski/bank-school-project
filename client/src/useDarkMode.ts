import { useEffect, useState } from 'react';

export const useDarkMode = () => {
	const [dark, setDark] = useState<boolean>(() => {
		const saved = localStorage.getItem('theme');
		return saved ? saved === 'dark' : false;
	});

	useEffect(() => {
		const root = document.documentElement;

		if (dark) {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [dark]);

	return { dark, setDark };
};

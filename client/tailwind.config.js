/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				'primary-hover': 'var(--color-primary-hover)',
				'primary-light': 'var(--color-primary-light)',

				secondary: 'var(--color-secondary)',
				'secondary-hover': 'var(--color-secondary-hover)',

				success: 'var(--color-success)',
				'success-hover': 'var(--color-success-hover)',

				warning: 'var(--color-warning)',
				'warning-hover': 'var(--color-warning-hover)',

				error: 'var(--color-error)',
				'error-hover': 'var(--color-error-hover)',

				info: 'var(--color-info)',
				'info-hover': 'var(--color-info-hover)',

				white: 'var(--color-white)',
				'white-hover': 'var(--color-white-hover)',

				black: 'var(--color-black)',
				gray: 'var(--color-gray)',

				/* 🎯 UI kolory */
				bg: 'var(--color-bg)',
				'bg-secondary': 'var(--color-bg-secondary)',
				text: 'var(--color-text)',
			},
		},
	},
	plugins: [],
};

import { authApi } from '@/api/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
	const navigate = useNavigate(); // ✅ hook na górze komponentu

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [emailError, setEmailError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const validateEmail = (value: string) => {
		if (!value) return 'Email jest wymagany';

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(value)) {
			return 'Niepoprawny email';
		}

		return null;
	};

	const validatePassword = (value: string) => {
		if (!value) return 'Hasło jest wymagane';

		if (value.length < 8) {
			return 'Hasło musi mieć minimum 8 znaków';
		}

		return null;
	};

	const handleLogin = async () => {
		setError(null);
		setLoading(true);

		const dto = {
			email,
			password,
		};

		try {
			const data = await authApi.login(dto);

			localStorage.setItem('accessToken', data.accessToken);
			localStorage.setItem('user', JSON.stringify(data.user));

			navigate('/'); // ✅ użycie navigate
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2>Logowanie</h2>

			{error && <p>{error}</p>}

			<input
				type='email'
				placeholder='Email'
				value={email}
				onBlur={() => setEmailError(validateEmail(email))}
				onChange={(e) => setEmail(e.target.value)}
			/>

			{emailError && <p>{emailError}</p>}

			<input
				type='password'
				placeholder='Hasło'
				value={password}
				onBlur={() => setPasswordError(validatePassword(password))}
				onChange={(e) => setPassword(e.target.value)}
			/>

			{passwordError && <p>{passwordError}</p>}

			<button onClick={handleLogin} disabled={loading || !!emailError || !!passwordError}>
				{loading ? 'Logowanie...' : 'Zaloguj'}
			</button>
		</div>
	);
};

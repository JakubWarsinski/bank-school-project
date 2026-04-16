export const getUser = () => {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
	const user = localStorage.getItem('user');

	if (!user) return false;

	return true;
};

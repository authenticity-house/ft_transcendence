import apiEndpoints from '../constants/apiConfig.js';

function fetchLoginCheck() {
	fetch(apiEndpoints.LOGIN_CHECK_URL, { method: 'GET' })
		.then((res) => {
			if (res.status === 200) return true;
			return false;
		})
		.catch((error) => {
			console.error('Error fetching login status:', error);
			return false;
		});
}

export { fetchLoginCheck };

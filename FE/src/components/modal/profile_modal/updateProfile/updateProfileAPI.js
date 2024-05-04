import apiEndpoints from '../../../../constants/apiConfig.js';
import { getCookie } from '../../../../utils/getCookie.js';

export async function updateProfileAPI(value) {
	const csrfToken = getCookie('csrftoken');
	const formData = new FormData();

	if (typeof value === 'string') {
		formData.append('nickname', value);
	}

	try {
		const response = await fetch(apiEndpoints.UPDATE_USER_URL, {
			method: 'PATCH',
			headers: {
				'X-CSRFToken': csrfToken
			},
			body: formData
		});

		const data = await response.json();
		const { status, ok } = response;

		if (ok) {
			return data.nickname;
		}
		if (status === 400) {
			return null;
		}
	} catch (error) {
		console.error('Error:', error);
	}
	return null;
}

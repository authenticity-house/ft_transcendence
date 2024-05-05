import apiEndpoints from '../../../../constants/apiConfig.js';
import { getCookie } from '../../../../utils/getCookie.js';
import { formDataToJson } from '../../../../utils/formDataToJson.js';

export async function updateProfileAPI(formData) {
	const csrfToken = getCookie('csrftoken');

	const payload = formDataToJson(formData);

	try {
		const response = await fetch(apiEndpoints.UPDATE_USER_URL, {
			method: 'PATCH',
			headers: {
				'X-CSRFToken': csrfToken,
				'Content-Type': 'application/json'
			},
			body: payload
		});

		const data = await response.json();

		const { status, ok } = response;

		if (ok) {
			if (data.nickname) return data.nickname;

			return true;
		}
		if (status === 400) {
			return null;
		}
	} catch (error) {
		console.error('Error:', error);
	}
	return null;
}

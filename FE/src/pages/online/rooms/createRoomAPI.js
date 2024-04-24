import { getCookie } from '../../../utils/getCookie.js';
import apiEndpoints from '../../../constants/apiConfig.js';

export default async function createRoomAPI(roomData) {
	const payload = JSON.stringify(roomData);
	const csrfToken = getCookie('csrftoken');

	try {
		const response = await fetch(apiEndpoints.ROOMS_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			body: payload
		});

		if (response.ok || response.status === 201) {
			const data = await response.json();
			return data.room_number;
		}
		return false;
	} catch (error) {
		return false;
	}
}

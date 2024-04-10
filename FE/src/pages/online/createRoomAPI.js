import { changeUrl } from '../../index.js';
import { getCookie } from '../../utils/getCookie.js';
import apiEndpoints from '../../constants/apiConfig.js';

export function createRoomAPI(roomData) {
	const payload = JSON.stringify(roomData);
	const csrfToken = getCookie('csrftoken');

	fetch(apiEndpoints.ROOMS_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		},
		body: payload
	})
		.then((res) => {
			// 201 : Created
			if (res.ok || res.status === 201) {
				changeUrl('waitingRoom');
			}
			return res.json();
		})
		.then((data) => console.log(data));
}

import apiEndpoints from '../../../constants/apiConfig.js';
import { getCookie } from '../../../utils/getCookie.js';

// 방 번호 받아와서 방 참가 API 호출
// POST /api/rooms/<room_number>/
export default async function joinRoomAPI(roomNumber) {
	const csrfToken = getCookie('csrftoken');

	return fetch(`${apiEndpoints.ROOMS_URL}${roomNumber}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken
		}
	}).then((res) => {
		// 201 : Created
		if (res.ok || res.status === 201) {
			// 방 참가 api 호출 성공
			return true;
		}
		// 400 : 방 참가 실패
		return false;
	});
}

import apiEndpoints from '../constants/apiConfig.js';
import { changeUrl } from '../index.js';
import { getCookie } from '../utils/getCookie.js';

const html = String.raw;

function appendChildSpan(parentClass, text) {
	const childElement = document.createElement('span');
	childElement.textContent = text;
	document.querySelector(parentClass).appendChild(childElement);
}

function fetchProfileDataAndDisplay() {
	fetch(apiEndpoints.MY_INFO_URL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken')
		},
		mode: 'same-origin'
	})
		.then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					const ImgSrc = data.profile_url;
					// 1. img
					const imgElement = document.createElement('img');
					imgElement.src = ImgSrc;
					imgElement.alt = 'user';
					imgElement.className = 'user-profile-summary-img';
					document
						.querySelector('.user-profile-img-wrapper')
						.appendChild(imgElement);
					// 2. nickName
					const nickNameElement = document.querySelector(
						'.user-profile-nickname'
					);
					nickNameElement.textContent = data.nickname;
				});
			}
		})
		// eslint-disable-next-line no-unused-vars
		.catch((error) => {});

	fetch(apiEndpoints.STATS_SUMMARY_URL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken')
		},
		mode: 'same-origin'
	})
		.then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					appendChildSpan(
						'.user-profile-summary',
						`${data.total_count}전 ${data.wins_count}승 ${data.losses_count}패`
					);
					appendChildSpan(
						'.user-profile-summary',
						`승률 ${data.winning_rate}%`
					);
					appendChildSpan('.user-profile-summary', `레이팅 ${data.rating}점`);
				});
			}
		})
		// eslint-disable-next-line no-unused-vars
		.catch((error) => {});
}

function getRoomElementAll(roomList) {
	let allRoom = '';
	roomList.forEach((room) => {
		const color =
			room.battle_mode === 2
				? ['head_pink_neon_15', 'pink_neon_10']
				: ['head_blue_neon_15', 'blue_neon_10'];
		const battleMode = room.battle_mode === 2 ? '토너먼트' : '1 vs 1';

		const singleRoom = html`
			<button
				class="single-room-button ${color[0]}"
				id="room-number-${room.room_number}"
			>
				<div class="single-room-match-mode">
					<span class="${color[1]} display-light18">${battleMode}</span>
				</div>
				<div class="single-room-title">
					<p class="display-light16">${room.room_name}</p>
				</div>
				<div class="single-room-bottom display-light16">
					<span>레이팅: ${room.rating}점</span>
					<div class="single-room-people">
						<span>${room.current_headcount} / ${room.max_headcount}</span>
					</div>
				</div>
			</button>
		`;
		allRoom += singleRoom;
	});
	return allRoom;
}

function fetchRoomsDataAndDisplay() {
	fetch(apiEndpoints.ROOMS_URL, { method: 'GET' })
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			return null;
		})
		.then((roomsData) => {
			if (roomsData === null) changeUrl('playMode');
			else {
				const roomListContainer = document.querySelector(
					'.room-list-container'
				);
				const allRoomsHtml = getRoomElementAll(roomsData);
				const roomsList = document
					.createRange()
					.createContextualFragment(allRoomsHtml);
				roomListContainer.appendChild(roomsList);
			}
		});
}

export { fetchProfileDataAndDisplay, fetchRoomsDataAndDisplay };

import apiEndpoints from '../constants/apiConfig.js';
import { changeUrl } from '../index.js';

const html = String.raw;

function appendChildSpan(parentClass, text) {
	const childElement = document.createElement('span');
	childElement.textContent = text;
	document.querySelector(parentClass).appendChild(childElement);
}

function fetchProfileDataAndDisplay() {
	// MOCK DATA
	const profileData = {
		image: '',
		nickName: '종석',
		winLossRecord: [100, 50, 50],
		winRate: 50,
		rating: 4242
	};

	const ImgSrc = profileData.image || 'image/default-profile.png';
	const record = profileData.winLossRecord;
	// 1. img
	const imgElement = document.createElement('img');
	imgElement.src = ImgSrc;
	imgElement.alt = 'user';
	imgElement.className = 'user-profile-img';
	document.querySelector('.user-profile-wrapper').appendChild(imgElement);
	// 2. nickName
	const nickNameElement = document.querySelector('.user-profile-nickname');
	nickNameElement.textContent = profileData.nickName;
	// 3. profile summary
	appendChildSpan(
		'.user-profile-summary',
		`${record[0]}전 ${record[1]}승 ${record[2]}패`
	);
	appendChildSpan('.user-profile-summary', `승률 ${profileData.winRate}%`);
	appendChildSpan('.user-profile-summary', `레이팅 ${profileData.rating}점`);
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
			<button class="single-room-button ${color[0]}">
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
			if (roomsData === null) changeUrl('play');
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

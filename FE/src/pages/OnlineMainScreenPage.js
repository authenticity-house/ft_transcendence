/* eslint-disable no-void */
import { changeUrl } from '../index.js';
import { profileWindow } from '../components/ProfileWindow.js';
import {
	roomListWindow,
	getRoomElementAll
} from '../components/RoomListWindow.js';
import apiEndpoints from '../constants/apiConfig.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class OnlineMainScreenPage {
	constructor() {
		this.refreshButtonEnabled = true; // 새로고침 버튼 클릭 가능 여부를 추적하는 변수
	}

	template() {
		// + Mock data - profileData
		const profileData = {
			image: '',
			nickName: '종석',
			winLossRecord: [100, 50, 50],
			winRate: 50,
			rating: 4242
		};
		const profileWindowElement = profileWindow(profileData);

		const roomsData = this.getRoomsData();
		const roomListWindowElement = roomListWindow(roomsData);

		const backButton = new ButtonBackArrow();

		return html`
			<div class="large-window head_white_neon_15">
				${profileWindowElement} ${roomListWindowElement}
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		const roomListContainer = document.querySelector('.room-list-container');
		const refreshButton = document.querySelector('.room-list-refresh-button');
		const refreshImg = document.querySelector('.room-list-refresh-img');

		refreshButton.addEventListener('click', () => {
			if (!this.refreshButtonEnabled) return; // 클릭 가능 여부를 체크하여 클릭 무시

			refreshImg.style.animation = 'none';
			setTimeout(() => {
				refreshImg.style.animation = '';
			}, 10);
			this.refreshButtonEnabled = false; // 클릭 비활성화
			setTimeout(() => {
				this.refreshButtonEnabled = true; // 3초 후에 다시 클릭 가능하도록 활성화
			}, 3000);

			// 방 데이터 가져오기
			const roomsData = this.getRoomsData();
			// 기존 방 리스트들 삭제
			while (roomListContainer.firstChild) {
				roomListContainer.removeChild(roomListContainer.firstChild);
			}
			// 새로운 방 데이터로 방 리스트 생성
			const newRoomsHtml = getRoomElementAll(roomsData);
			const newRoomsList = document
				.createRange()
				.createContextualFragment(newRoomsHtml);
			roomListContainer.appendChild(newRoomsList);
		});

		roomListContainer.addEventListener('click', (event) => {
			const { target } = event;
			// 클릭된 요소가 .single-room-button인 경우에만 changeUrl('waitingRoom') 호출
			if (target && target.closest('.single-room-button')) {
				changeUrl('waitingRoom');
			}
		});

		const backButton = document.querySelector('.button-back-in-window');
		backButton.addEventListener('click', () => {
			changeUrl('play');
		});

		const createRoom = document.querySelector('.create-room-button');
		createRoom.addEventListener('click', () => {
			changeUrl('onlineSetting');
		});
	}

	getRoomsData() {
		const request = new XMLHttpRequest();
		request.open('GET', apiEndpoints.ROOMS_URL, false);
		request.send();

		if (request.status === 200) {
			return JSON.parse(request.responseText);
		}
		console.error('Error fetching data:', request.statusText);
		return null;
	}
}

export default new OnlineMainScreenPage();

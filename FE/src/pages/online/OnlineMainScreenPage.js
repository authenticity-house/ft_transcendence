/* eslint-disable no-void */
import { changeUrl } from '../../index.js';
import {
	fetchProfileDataAndDisplay,
	fetchRoomsDataAndDisplay
} from '../../components/FetchOnlineMainScreen.js';
import ButtonBackArrow from '../../components/ButtonBackArrow.js';

import { joinRoom } from './rooms/roomManager.js';

const html = String.raw;

class OnlineMainScreenPage {
	constructor() {
		this.refreshButtonEnabled = true; // 새로고침 버튼 클릭 가능 여부를 추적하는 변수
	}

	template() {
		const backButton = new ButtonBackArrow();

		return html`
			<div class="large-window head_white_neon_15">
				<div class="user-profile-container">
					<div class="user-profile-wrapper"></div>
					<span
						class="user-profile-nickname display-medium48 yellow_neon_10"
					></span>
					<div class="user-profile-summary display-light24"></div>
					<button class="create-room-button head_blue_neon_15">
						<span class="display-light24 blue_neon_10">방만들기</span>
					</button>
				</div>
				<div class="room-list-window">
					<div class="room-list-header">
						<p class="display-medium48 yellow_neon_10">방 목록</p>
						<button class="room-list-refresh-button">
							<img
								src="image/refresh.png"
								alt="refresh"
								class="room-list-refresh-img"
								style="animation: none"
							/>
						</button>
					</div>
					<div class="room-list-container"></div>
				</div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	mount() {
		fetchProfileDataAndDisplay();
		fetchRoomsDataAndDisplay();
	}

	addEventListeners() {
		const roomListContainer = document.querySelector('.room-list-container');
		const refreshButton = document.querySelector('.room-list-refresh-button');
		const refreshImg = document.querySelector('.room-list-refresh-img');

		refreshButton.addEventListener('click', () => {
			if (!this.refreshButtonEnabled) return; // 클릭 가능 여부를 체크하여 클릭 무시

			// click animation
			refreshImg.style.animation = 'none';
			setTimeout(() => {
				refreshImg.style.animation = '';
			}, 10);
			this.refreshButtonEnabled = false; // 클릭 비활성화
			setTimeout(() => {
				this.refreshButtonEnabled = true; // 3초 후에 다시 클릭 가능하도록 활성화
			}, 3000);

			// 기존 방 리스트들 삭제
			while (roomListContainer.firstChild) {
				roomListContainer.removeChild(roomListContainer.firstChild);
			}
			// 방 데이터 가져와서 띄우기
			fetchRoomsDataAndDisplay();
		});

		roomListContainer.addEventListener('click', (event) => {
			const { target } = event;
			if (target && target.closest('.single-room-button')) {
				const button = target.closest('.single-room-button');
				const { id } = button;
				const roomNumber = id.split('room-number-')[1];

				joinRoom(roomNumber);
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
}

export default new OnlineMainScreenPage();

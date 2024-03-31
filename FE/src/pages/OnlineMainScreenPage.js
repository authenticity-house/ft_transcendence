/* eslint-disable no-void */
import { changeUrl } from '../index.js';
import { profileButton } from '../components/ProfileButton.js';
import { profileWindow } from '../components/ProfileWindow.js';
import { roomListWindow } from '../components/RoomListWindow.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class OnlineMainScreenPage {
	template() {
		// + data - user profile image
		const profileButtonComponent = profileButton();
		// + data - user profile image, nickname, profile summary
		const profileWindowElement = profileWindow();
		// + MOCK data - roomList
		const roomList = [
			{
				matchMode: '1 vs 1',
				roomTitle: '아무나 들어오세!',
				rating: '1000',
				peopleMax: '2',
				peopleNow: '1'
			},
			{
				matchMode: 'tournament',
				roomTitle: '8인 토너먼트 고수만!',
				rating: '3000',
				peopleMax: '8',
				peopleNow: '3'
			},
			{
				matchMode: '1 vs 1',
				roomTitle: '아무나 들어오세!',
				rating: '1000',
				peopleMax: '2',
				peopleNow: '1'
			}
		];
		const roomListWindowElement = roomListWindow(roomList);
		const backButton = new ButtonBackArrow();
		return html`
			${profileButtonComponent}
			<div class="large-window head_white_neon_15">
				${profileWindowElement} ${roomListWindowElement}
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		const userProfileButton = document.querySelector('.user-profile-button');
		userProfileButton.addEventListener('click', () => {
			const infoModalContainer = document.querySelector(
				'.info-modal-container'
			);
			infoModalContainer.classList.toggle('modal-button-hidden');
		});
		const refreshButton = document.querySelector('.room-list-refresh-button');
		const refreshImg = document.querySelector('.room-list-refresh-img');

		refreshButton.addEventListener('click', () => {
			// 방 목록 데이터 다시 가져오기 로직 추가

			// 애니메이션을 재시작하기 위해 애니메이션 이름을 변경
			refreshImg.style.animation = 'none';
			setTimeout(() => {
				refreshImg.style.animation = '';
			}, 10); // 잠시 대기 후 애니메이션을 다시 설정
		});
		const backButton = document.querySelector('.button-back-in-window');
		backButton.addEventListener('click', () => {
			changeUrl('play');
		});
	}
}

export default new OnlineMainScreenPage();

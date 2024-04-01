/* eslint-disable no-void */
import { changeUrl } from '../index.js';
import { profileWindow } from '../components/ProfileWindow.js';
import { roomListWindow } from '../components/RoomListWindow.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class OnlineMainScreenPage {
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
				matchMode: '1vs1',
				roomTitle: '아무나 들어오세!',
				rating: '1000',
				peopleMax: '2',
				peopleNow: '1'
			}
		];
		const roomListWindowElement = roomListWindow(roomList);
		const backButton = new ButtonBackArrow();

		return html`
			<div class="large-window head_white_neon_15">
				${profileWindowElement} ${roomListWindowElement}
				<div class="online-main-back-button">${backButton.template()}</div>
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
			// + 방 목록 데이터 다시 가져오기 로직 추가
			refreshImg.style.animation = 'none';
			setTimeout(() => {
				refreshImg.style.animation = '';
			}, 10);
		});
		const backButton = document.querySelector('.online-main-back-button');
		backButton.addEventListener('click', () => {
			changeUrl('play');
		});
	}
}

export default new OnlineMainScreenPage();

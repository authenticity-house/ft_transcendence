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
			${profileButtonComponent}
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
		refreshButton.addEventListener('click', () => {
			// + 방 목록 데이터 다시 가져오기
			document
				.querySelector('.room-list-refresh-img')
				.classList.toggle('rotated');
		});
		const backButton = document.querySelector('.online-main-back-button');
		backButton.addEventListener('click', () => {
			changeUrl('play');
		});
	}
}

export default new OnlineMainScreenPage();

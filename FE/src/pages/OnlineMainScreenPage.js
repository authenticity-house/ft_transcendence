import { changeUrl } from '../index.js';
import { profileButton } from '../components/ProfileButton.js';
import { profileWindow } from '../components/ProfileWindow.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class OnlineMainScreenPage {
	template() {
		// + data - user profile image
		const profileButtonComponent = profileButton();
		// + data - user profile image, nickname, profile summary
		const userProfileComponent = profileWindow();
		const backButton = new ButtonBackArrow();

		return html`
			${profileButtonComponent}
			<div class="large-window head_white_neon_15">
				${userProfileComponent}
				<div class="room-list-container"></div>
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

		// delete - changeUrl
		const backButton = document.querySelector('.online-main-back-button');
		backButton.addEventListener('click', () => {
			changeUrl('play');
		});
	}
}

export default new OnlineMainScreenPage();

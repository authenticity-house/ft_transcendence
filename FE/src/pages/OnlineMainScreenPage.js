import { changeUrl } from '../index.js';
import { profileButton } from '../components/ProfileButton.js';

const html = String.raw;

class OnlineMainScreenPage {
	template() {
		const profileButtonContainer = profileButton();
		return html`
			<div class="profile-button-container">${profileButtonContainer}</div>
			<div class="large-window head_white_neon_15">
				<div class="user-profile-container"></div>
				<div class="room-list-container"></div>
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
		const signupLink = document.querySelector('.login-signup-link');
		signupLink.addEventListener('click', () => {
			changeUrl('register');
		});
	}
}

export default new OnlineMainScreenPage();

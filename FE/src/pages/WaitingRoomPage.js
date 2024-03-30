import { changeUrl } from '../index.js';
import { profileButton } from '../components/ProfileButton.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class WaitingRoomPage {
	template() {
		// + data - user profile image
		const profileButtonComponent = profileButton();
		const backButton = new ButtonBackArrow();

		return html`
			${profileButtonComponent}
			<div class="large-window head_white_neon_15">
				<div></div>
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

		const backButton = document.querySelector('.online-main-back-button');
		backButton.addEventListener('click', () => {
			changeUrl(''); // onlineMainScreen
		});
	}
}

export default new WaitingRoomPage();

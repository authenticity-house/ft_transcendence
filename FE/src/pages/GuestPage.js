import { changeUrl } from '../index.js';

const html = String.raw;

class GuestPage {
	template() {
		return html`
			<div class="guest-container head_white_neon_15">
				<div class="guest-title">
					<span class="guest-title-text display-medium48 yellow_neon_10"
						>게스트 로그인</span
					>
				</div>
				<button class="guest-button head_blue_neon_15 blue_neon_10">
					로그인
				</button>
			</div>
		`;
	}

	addEventListeners() {
		const guestButton = document.querySelector('.guest-button');
		guestButton.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new GuestPage();

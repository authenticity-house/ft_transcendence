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
				<div class="game-button-container">
					<button class="game-button head_blue_neon_15 blue_neon_10">
						게임 시작
					</button>
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
		const gameButton = document.querySelector('.game-button');
		gameButton.addEventListener('click', () => {
			changeUrl('gameSetting');
		});
	}
}

export default new GuestPage();

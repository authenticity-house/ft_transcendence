import { changeUrl } from '../index.js';

const html = String.raw;

class GameSettingPage {
	template() {
		return html`
			<div class="guest-container head_white_neon_15">
				<button class="game-start-button head_blue_neon_15 blue_neon_10">
					게임시작
				</button>
			</div>
		`;
	}

	addEventListeners() {
		const gameButton = document.querySelector('.game-start-button');
		gameButton.addEventListener('click', () => {
			changeUrl('game');
		});
	}
}

export default new GameSettingPage();

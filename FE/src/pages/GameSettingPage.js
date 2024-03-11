import { changeUrl } from '../index.js';
import HorizontalHeadCount from '../components/HorizontalHeadCount.js';

const html = String.raw;

class GameSettingPage {
	template() {
		const horizontalHeadCount = new HorizontalHeadCount('1vs1', '토너먼트');

		return html`
			<div class="small-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container">
						<div>${horizontalHeadCount.template()}</div>
						<div class="game-setting-nickname-container"></div>
					</div>
				</div>
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

import { changeUrl } from '../index.js';
import HorizontalHeadCount from '../components/HorizontalHeadCount.js';
import VerticalSmallButton from '../components/VerticalSmallButton.js';

const html = String.raw;

class GameSettingPage {
	template() {
		const horizonbuttonConfigs = [{ text: '1vs1' }, { text: '토너먼트' }];
		const horizontalHeadCount = new HorizontalHeadCount(horizonbuttonConfigs);

		const virticalbuttonConfigs = [
			{ text: '세부설정', classes: 'head_blue_neon_15 blue_neon_10' },
			{ text: '시작', classes: 'head_blue_neon_15 blue_neon_10' }
		];
		const verticalSmallButton = new VerticalSmallButton(virticalbuttonConfigs);
		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container">
						<div>${horizontalHeadCount.template()}</div>
						<div class="game-setting-nickname-container"></div>
					</div>
					<div class="verticalButton">${verticalSmallButton.template()}</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const detailedButton = document.querySelector(
			'.verticalButton button:first-child'
		);
		detailedButton.addEventListener('click', () => {
			changeUrl('gameSettingDetailed');
		});

		const startButton = document.querySelector(
			'.verticalButton button:nth-child(2)'
		);
		startButton.addEventListener('click', () => {
			changeUrl('game');
		});
	}
}

export default new GameSettingPage();

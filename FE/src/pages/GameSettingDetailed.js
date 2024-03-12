import { changeUrl } from '../index.js';
import HorizontalHeadCount from '../components/HorizontalHeadCount.js';
import VerticalSmallButton from '../components/VerticalSmallButton.js';

const html = String.raw;

class GameSettingPage {
	template() {
		const pointConfigs = [
			{ text: '5', classes: 'button-select' },
			{ text: '1000', classes: 'button-select' },
			{ text: '10', classes: 'button-select' }
		];
		const point = new HorizontalHeadCount(pointConfigs, '54rem');

		const levelConfigs = [
			{ text: '쉬움', classes: 'button-select' },
			{ text: '100000', classes: 'button-select' },
			{ text: '어려움', classes: 'button-select' }
		];
		const level = new HorizontalHeadCount(levelConfigs, '54rem');

		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container">
						<div>${point.template()}</div>
						<div>${level.template()}</div>
					</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const detailedButton = document.querySelector(
			'.verticalButton button:nth-child(1)'
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

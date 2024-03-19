import { changeUrlData } from '../index.js';
import HorizontalButton from '../components/HorizontalButton.js';
import VerticalButton from '../components/VerticalButton.js';
import { activateButtons } from '../components/ActivateButtons.js';

const html = String.raw;

class GameSettingPage {
	constructor() {
		this.initialData = {
			battle_mode: 1,
			total_score: 2,
			level: 2,
			color: {
				paddle: '#5AD7FF',
				ball: '#FFD164'
			}
		};
	}

	template(data) {
		if (data == null) this.data = this.initialData;
		else this.data = data;

		const horizonbuttonConfigs = [
			{ text: '1vs1', classes: 'selected' },
			{ text: '토너먼트' }
		];
		const horizontalButton = new HorizontalButton(
			horizonbuttonConfigs,
			'60rem'
		);

		const virticalbuttonConfigs = [
			{ text: '세부설정', classes: 'head_blue_neon_15 blue_neon_10' },
			{ text: '시작', classes: 'head_blue_neon_15 blue_neon_10' }
		];
		const verticalButton = new VerticalButton(virticalbuttonConfigs);
		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container">
						<div class="horizontalButton">${horizontalButton.template()}</div>
						<div class="game-setting-nickname-container"></div>
					</div>
					<div class="verticalButton">${verticalButton.template()}</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		activateButtons('.horizontalButton');
		const detailedButton = document.querySelector(
			'.verticalButton button:nth-child(1)'
		);
		detailedButton.addEventListener('click', () => {
			changeUrlData('gameSettingDetailed', this.data);
		});

		const startButton = document.querySelector(
			'.verticalButton button:nth-child(2)'
		);
		startButton.addEventListener('click', () => {
			changeUrlData('game', this.data);
		});
	}
}

export default new GameSettingPage();

import { changeUrl } from '../index.js';
import HorizontalHeadCount from '../components/HorizontalHeadCount.js';
import VerticalSmallButton from '../components/VerticalSmallButton.js';

const html = String.raw;

class GameSettingDetailed {
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
		const paddleColor = new HorizontalHeadCount(
			[{ text: 'D9D9D9', classes: 'button-select' }],
			'54rem'
		);
		const backColor = new HorizontalHeadCount(
			[{ text: 'ffffff', classes: 'button-select' }],
			'54rem'
		);
		const virticalbuttonConfigs = [
			{
				text: '초기화',
				classes: 'button-reset-complete head_blue_neon_15 blue_neon_10'
			},
			{
				text: '완료',
				classes: 'button-reset-complete head_blue_neon_15 blue_neon_10'
			}
		];
		const horizontalButton = new HorizontalHeadCount(
			virticalbuttonConfigs,
			'51rem'
		);

		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container wide-element-66">
						<div class="horizontal-button-container wide-element-66">
							<p class="text-subtitle-1">승점</p>
							<div>${point.template()}</div>
						</div>
						<div class="horizontal-button-container wide-element-66">
							<p class="text-subtitle-1">난이도</p>
							<div>${level.template()}</div>
						</div>
						<div class="horizontal-button-container wide-element-66">
							<p class="text-subtitle-1">패들색</p>
							<div>${paddleColor.template()}</div>
						</div>
						<div class="horizontal-button-container wide-element-66">
							<p class="text-subtitle-1">배경색</p>
							<div>${backColor.template()}</div>
						</div>
					</div>
					<div class="horizontalButton">${horizontalButton.template()}</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const resetButton = document.querySelector(
			'.horizontalButton button:nth-child(1)'
		);
		resetButton.addEventListener('click', () => {
			changeUrl('gameSettingDetailed');
		});

		const backButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		backButton.addEventListener('click', () => {
			changeUrl('gameSetting');
		});
	}
}

export default new GameSettingDetailed();

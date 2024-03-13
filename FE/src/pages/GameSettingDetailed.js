import { changeUrl } from '../index.js';
import HorizontalHeadCount from '../components/HorizontalHeadCount.js';
import { ActivateButtons } from '../components/ActivateButtons.js';

const html = String.raw;

function createColorPickerComponent(colorCode, pickerId, buttonId) {
	const colorPicker = `<input type="color" id="${pickerId}" value="${colorCode}" style="visibility:hidden; width:0; height:0;"/>`;
	const colorDisplayButton = `<button class="button-select" id="${buttonId}" onclick="document.getElementById('${pickerId}').click()">${colorCode}</button>`;
	const colorDisplay = `<div class="color-display" style="background-color:${colorCode}; width:6rem; height:6rem; display:inline-block;"></div>`;

	return { colorPicker, colorDisplayButton, colorDisplay };
}

class GameSettingDetailed {
	constructor() {
		this.paddleColorCode = '#D9D9D9';
		this.backColorCode = '#D9D9D9';
	}

	template() {
		const pointConfigs = [
			{ text: '5', classes: 'button-select' },
			{ text: '10', classes: 'button-select selected' },
			{ text: '15', classes: 'button-select' }
		];
		const point = new HorizontalHeadCount(pointConfigs, '54rem');

		const levelConfigs = [
			{ text: '쉬움', classes: 'button-select' },
			{ text: '보통', classes: 'button-select selected' },
			{ text: '어려움', classes: 'button-select' }
		];
		const level = new HorizontalHeadCount(levelConfigs, '54rem');

		const paddleColor = createColorPickerComponent(
			this.paddleColorCode,
			'paddleColorPicker',
			'paddleColorButton'
		);
		const backColor = createColorPickerComponent(
			this.backColorCode,
			'backColorPicker',
			'backColorButton'
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
					<div class="game-setting-content-container width-66">
						<div class="horizontal-button-container activate-button width-66">
							<p class="text-subtitle-1">승점</p>
							<div>${point.template()}</div>
						</div>
						<div class="horizontal-button-container activate-button width-66">
							<p class="text-subtitle-1">난이도</p>
							<div>${level.template()}</div>
						</div>
						<div class="horizontal-button-container width-66">
							<p class="text-subtitle-1">패들색</p>
							<div class="horizontal-button-container width-54">
								${paddleColor.colorPicker}${paddleColor.colorDisplayButton}${paddleColor.colorDisplay}
							</div>
						</div>
						<div class="horizontal-button-container width-66">
							<p class="text-subtitle-1">배경색</p>
							<div class="horizontal-button-container width-54">
								${backColor.colorPicker}${backColor.colorDisplayButton}${backColor.colorDisplay}
							</div>
						</div>
					</div>
					<div class="horizontalButton">${horizontalButton.template()}</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		ActivateButtons('.activate-button');
		const resetButton = document.querySelector(
			'.horizontalButton button:nth-child(1)'
		);
		resetButton.addEventListener('click', () => {
			changeUrl('gameSettingDetailed');
		});

		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		confirmButton.addEventListener('click', () => {
			changeUrl('gameSetting');
		});

		const paddleColorPicker = document.getElementById('paddleColorPicker');
		paddleColorPicker.addEventListener('change', (e) => {
			this.paddleColorCode = e.target.value;
			document.getElementById('paddleColorButton').textContent =
				this.paddleColorCode;
			document.querySelector(
				'#paddleColorButton + .color-display'
			).style.backgroundColor = this.paddleColorCode;
		});

		// 배경색 선택기 이벤트 리스너 (예시로 추가한 배경색 코드 변수를 사용해야 합니다)
		const backColorPicker = document.getElementById('backColorPicker');
		backColorPicker.addEventListener('change', (e) => {
			this.backColorCode = e.target.value;
			document.getElementById('backColorButton').textContent =
				this.backColorCode;
			document.querySelector(
				'#backColorButton + .color-display'
			).style.backgroundColor = this.backColorCode;
		});
	}
}

export default new GameSettingDetailed();

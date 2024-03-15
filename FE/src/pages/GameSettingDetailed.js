import { changeUrl } from '../index.js';
import HorizontalHeadCount from '../components/HorizontalHeadCount.js';

const html = String.raw;

function createColorPicker(colorCode, pickerId, buttonId) {
	const colorPicker = `<input type="color" id="${pickerId}" value="${colorCode}" class="color-picker-hidden"/>`;
	const colorDisplayButton = `<button class="button-select" id="${buttonId}" onclick="document.getElementById('${pickerId}').click()">${colorCode}</button>`;
	const colorDisplay = `<div class="color-display" style="background-color:${colorCode};"></div>`;

	return { colorPicker, colorDisplayButton, colorDisplay };
}

function createButtonConfigs(buttonTexts, classes) {
	return buttonTexts.map((text) => ({ text, classes }));
}

function createConfig(texts, classesPrefix, selectedIndices) {
	return texts.map((text, index) => ({
		text,
		classes: `${classesPrefix}${selectedIndices === index + 1 ? ' selected' : ''}`
	}));
}

class GameSettingDetailed {
	template(initial) {
		this.data = initial;
		// console.log(this.data.total_score, this.data.level);
		const scoreTexts = ['5', '10', '15'];
		const levelTexts = ['쉬움', '보통', '어려움'];

		const scoreConfigs = createConfig(
			scoreTexts,
			'button-select',
			this.data.total_score
		);
		const levelConfigs = createConfig(
			levelTexts,
			'button-select',
			this.data.level
		);

		const score = new HorizontalHeadCount(scoreConfigs, '54rem');
		const level = new HorizontalHeadCount(levelConfigs, '54rem');

		const paddleColor = createColorPicker(
			this.data.color.paddle,
			'paddleColorPicker',
			'paddleColorButton'
		);
		const backColor = createColorPicker(
			this.data.color.background,
			'backColorPicker',
			'backColorButton'
		);

		const buttonTexts = ['초기화', '완료'];
		const buttonClasses =
			'button-reset-complete head_blue_neon_15 blue_neon_10';
		const virticalbuttonConfigs = createButtonConfigs(
			buttonTexts,
			buttonClasses
		);
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
							<div>${score.template()}</div>
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

	ActivateButtons(containerSelector) {
		document.querySelectorAll(containerSelector).forEach((container, index) => {
			container.querySelectorAll('button').forEach((btn, btnIndex) => {
				btn.addEventListener('click', (event) => {
					const clickedBtn = event.target;
					container.querySelectorAll('button').forEach((innerBtn) => {
						innerBtn.classList.remove('selected');
					});
					clickedBtn.classList.add('selected');
					if (index === 0) {
						this.data.total_score = btnIndex + 1;
					} else if (index === 1) {
						this.data.level = btnIndex + 1;
					}
					// console.log(this.data.total_score, this.data.level);
				});
			});
		});
	}

	addEventListeners() {
		this.ActivateButtons('.activate-button');

		const paddleColorPicker = document.getElementById('paddleColorPicker');
		paddleColorPicker.addEventListener('change', (e) => {
			this.data.color.paddle = e.target.value;
			document.getElementById('paddleColorButton').textContent =
				this.data.color.paddle;
			document.querySelector(
				'#paddleColorButton + .color-display'
			).style.backgroundColor = this.data.color.paddle;
		});

		const backColorPicker = document.getElementById('backColorPicker');
		backColorPicker.addEventListener('change', (e) => {
			this.data.color.background = e.target.value;
			document.getElementById('backColorButton').textContent =
				this.data.color.background;
			document.querySelector(
				'#backColorButton + .color-display'
			).style.backgroundColor = this.data.color.background;
		});

		const resetButton = document.querySelector(
			'.horizontalButton button:nth-child(1)'
		);
		resetButton.addEventListener('click', () => {
			const newData = {
				battle_mode: 1,
				total_score: 2,
				level: 2,
				color: {
					paddle: '#FFFFFF',
					background: '#FFFFFF'
				}
			};
			changeUrl('gameSettingDetailed', newData);
		});

		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		confirmButton.addEventListener('click', () => {
			changeUrl('gameSetting', this.data);
		});
	}
}

export default new GameSettingDetailed();

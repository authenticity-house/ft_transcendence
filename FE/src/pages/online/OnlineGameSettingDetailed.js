import { changeUrlData } from '../../index.js';
import HorizontalButton from '../../components/HorizontalButton.js';

const html = String.raw;

function createColorPicker(colorCode, pickerId, buttonId) {
	const colorPicker = `<input type="color" id="${pickerId}" value="${colorCode}" class="color-picker-hidden"/>`;
	const colorDisplayButton = `<button class="button-select" id="${buttonId}" onclick="document.getElementById('${pickerId}').click()">${colorCode}</button>`;

	return { colorPicker, colorDisplayButton };
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

function deepCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

class OnlineGameSettingDetailed {
	template(initial) {
		this.initial = initial;
		this.data = deepCopy(initial);
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

		const score = new HorizontalButton(scoreConfigs, '54rem');
		const level = new HorizontalButton(levelConfigs, '54rem');

		const paddleColor = createColorPicker(
			this.data.color.paddle,
			'paddleColorPicker',
			'paddleColorButton'
		);
		const ballColor = createColorPicker(
			this.data.color.ball,
			'ballColorPicker',
			'ballColorButton'
		);

		const buttonTexts = ['초기화', '완료'];
		const buttonClasses =
			'button-reset-complete head_blue_neon_15 blue_neon_10';
		const virticalbuttonConfigs = createButtonConfigs(
			buttonTexts,
			buttonClasses
		);
		const horizontalButton = new HorizontalButton(
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
							<!-- 패들색/배경색 선택 title 및 버튼 -->
							<div class="vertical-button-container height-25">
								<div class="horizontal-button-container width-28">
									<p class="text-subtitle-1">패들색</p>
									<div class="horizontal-button-container">
										${paddleColor.colorPicker}${paddleColor.colorDisplayButton}
									</div>
								</div>
								<div class="horizontal-button-container width-28">
									<p class="text-subtitle-1">공색</p>
									<div class="horizontal-button-container">
										${ballColor.colorPicker}${ballColor.colorDisplayButton}
									</div>
								</div>
							</div>
							<!-- 패들색/배경색 표시 -->
							<div class="color-display-back">
								<div
									class="color-display-paddle"
									style="background-color: ${this.data.color.paddle};
									box-shadow: 0rem 0rem 1.5rem 0rem ${this.data.color
										.paddle}, 0rem 0rem 1.5rem 0rem ${this.data.color.paddle};"
								></div>
								<div
									class="color-display-ball"
									style="background-color: ${this.data.color.ball};
									box-shadow: 0rem 0rem 1.5rem 0rem ${this.data.color
										.ball}, 0rem 0rem 1.5rem 0rem ${this.data.color.ball};"
								></div>
							</div>
						</div>
					</div>
					<div class="horizontalButton">${horizontalButton.template()}</div>
				</div>
			</div>
		`;
	}

	activateButtons(containerSelector) {
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
				});
			});
		});
	}

	addEventListeners() {
		this.activateButtons('.activate-button');

		const paddleColorPicker = document.getElementById('paddleColorPicker');
		paddleColorPicker.addEventListener('change', (e) => {
			this.data.color.paddle = e.target.value;
			document.getElementById('paddleColorButton').textContent =
				this.data.color.paddle;
			document.querySelector('.color-display-paddle').style.backgroundColor =
				this.data.color.paddle;
			document.querySelector('.color-display-paddle').style.boxShadow =
				`0rem 0rem 1.5rem 0rem ${this.data.color.paddle}, 0rem 0rem 1.5rem 0rem ${this.data.color.paddle}`;
		});

		const ballColorPicker = document.getElementById('ballColorPicker');
		ballColorPicker.addEventListener('change', (e) => {
			this.data.color.ball = e.target.value;
			document.getElementById('ballColorButton').textContent =
				this.data.color.ball;
			document.querySelector('.color-display-ball').style.backgroundColor =
				this.data.color.ball;
			document.querySelector('.color-display-ball').style.boxShadow =
				`0rem 0rem 1.5rem 0rem ${this.data.color.ball}, 0rem 0rem 1.5rem 0rem ${this.data.color.ball}`;
		});

		const resetButton = document.querySelector(
			'.horizontalButton button:nth-child(1)'
		);
		resetButton.addEventListener('click', () => {
			this.data = {
				battle_mode: deepCopy(this.initial.battle_mode),
				total_score: 2,
				level: 2,
				color: {
					paddle: '#5AD7FF',
					ball: '#FFD164'
				},
				headcount: deepCopy(this.initial.headcount),
				nickname: deepCopy(this.initial.nickname)
			};
			changeUrlData('onlineDetailed', this.data);
		});

		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		confirmButton.addEventListener('click', () => {
			if (this.data.battle_mode === 1)
				changeUrlData('onlineSetting', this.data);
			else if (this.data.battle_mode === 2)
				changeUrlData('onlineSettingTournament', this.data);
		});
	}
}

export default new OnlineGameSettingDetailed();

import { changeUrlData } from '../../index.js';
import HorizontalButton from '../HorizontalButton.js';
import {
	createColorPicker,
	createButtonConfigs,
	createConfig,
	deepCopy
} from './gameSettingUtils.js';

import { createButtonSection, createColorSection } from './gameSettingHTML.js';

const html = String.raw;

class GameSettingDetailedComponent {
	createScoreAndLevelConfig() {
		const scoreTexts = ['5', '10', '15'];
		const levelTexts = ['쉬움', '보통', '어려움'];

		return {
			score: new HorizontalButton(
				createConfig(scoreTexts, 'button-select', this.data.total_score),
				'54rem'
			),
			level: new HorizontalButton(
				createConfig(levelTexts, 'button-select', this.data.level),
				'54rem'
			)
		};
	}

	createColorConfig() {
		return {
			paddleColor: createColorPicker(
				this.data.color.paddle,
				'paddleColorPicker',
				'paddleColorButton'
			),
			ballColor: createColorPicker(
				this.data.color.ball,
				'ballColorPicker',
				'ballColorButton'
			)
		};
	}

	createButtons() {
		const buttonTexts = ['초기화', '완료'];
		const buttonClasses =
			'button-reset-complete head_blue_neon_15 blue_neon_10';
		return new HorizontalButton(
			createButtonConfigs(buttonTexts, buttonClasses),
			'51rem'
		);
	}

	template(initial, type) {
		this.initial = initial;
		this.data = deepCopy(initial);
		this.type = type;

		const { score, level } = this.createScoreAndLevelConfig();
		const { paddleColor, ballColor } = this.createColorConfig();
		const horizontalButton = this.createButtons();

		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container width-66">
						${createButtonSection('승점', score)}
						${createButtonSection('난이도', level)}
						${createColorSection(paddleColor, ballColor)}
					</div>
					<div class="horizontalButton">${horizontalButton.template()}</div>
				</div>
			</div>
		`;
	}

	// -----------------------------------------------------------------

	onButtonClicked(container, clickedBtn, index, btnIndex) {
		container.querySelectorAll('button').forEach((innerBtn) => {
			innerBtn.classList.remove('selected');
		});
		clickedBtn.classList.add('selected');

		if (index === 0) {
			this.data.total_score = btnIndex + 1;
		} else if (index === 1) {
			this.data.level = btnIndex + 1;
		}
	}

	activateButtons(containerSelector) {
		document.querySelectorAll(containerSelector).forEach((container, index) => {
			container.querySelectorAll('button').forEach((btn, btnIndex) => {
				btn.addEventListener('click', () =>
					this.onButtonClicked(container, btn, index, btnIndex)
				);
			});
		});
	}

	changeColor(elementId, element, elementColorSelector) {
		const color = this.data.color[element];
		document.getElementById(elementId).textContent = color;
		document.querySelector(elementColorSelector).style.backgroundColor = color;
		document.querySelector(elementColorSelector).style.boxShadow =
			`0rem 0rem 1.5rem 0rem ${color}, 0rem 0rem 1.5rem 0rem ${color}`;
	}

	addColorPickerEventListener(pickerId, colorKey, buttonId, displayClass) {
		const picker = document.getElementById(pickerId);
		picker.addEventListener('change', (e) => {
			this.data.color[colorKey] = e.target.value;
			this.changeColor(buttonId, colorKey, displayClass);
		});
	}

	resetData() {
		if (this.type === 'local') {
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
		} else {
			this.data = {
				battle_mode: deepCopy(this.initial.battle_mode),
				total_score: 2,
				level: 2,
				color: {
					paddle: '#5AD7FF',
					ball: '#FFD164'
				},
				max_headcount: deepCopy(this.initial.max_headcount),
				room_name: 'room'
			};
		}
	}

	resetUI() {
		document
			.querySelectorAll('.activate-button')
			.forEach((container, index) => {
				container.querySelectorAll('button').forEach((btn, btnIndex) => {
					btn.classList.remove('selected');
					if ((index === 0 || index === 1) && btnIndex === 1) {
						btn.classList.add('selected');
					}
				});
			});
		document.getElementById('paddleColorPicker').value = this.data.color.paddle;
		document.getElementById('ballColorPicker').value = this.data.color.ball;
		this.changeColor('paddleColorButton', 'paddle', '.color-display-paddle');
		this.changeColor('ballColorButton', 'ball', '.color-display-ball');
	}

	addResetEventListener() {
		const resetButton = document.querySelector(
			'.horizontalButton button:nth-child(1)'
		);
		resetButton.addEventListener('click', () => {
			this.resetData();
			this.resetUI();
		});
	}

	addConfirmEventListener() {
		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		const oneOnone = this.type === 'local' ? 'gameSetting' : 'onlineSetting';
		const tournament =
			this.type === 'local'
				? 'gameSettingTournament'
				: 'onlineSettingTournament';

		confirmButton.addEventListener('click', () => {
			if (this.data.battle_mode === 1) changeUrlData(oneOnone, this.data);
			else if (this.data.battle_mode === 2)
				changeUrlData(tournament, this.data);
		});
	}

	addEventListeners() {
		this.activateButtons('.activate-button');

		this.addColorPickerEventListener(
			'paddleColorPicker',
			'paddle',
			'paddleColorButton',
			'.color-display-paddle'
		);
		this.addColorPickerEventListener(
			'ballColorPicker',
			'ball',
			'ballColorButton',
			'.color-display-ball'
		);
		this.addResetEventListener();
		this.addConfirmEventListener();
	}
}
export default GameSettingDetailedComponent;

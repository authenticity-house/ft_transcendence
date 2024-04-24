import { changeUrlData } from '../../index.js';
import {
	createColorConfig,
	createScoreAndLevelConfig,
	createButtons,
	deepCopy
} from './gameSettingUtils.js';

import { createButtonSection, createColorSection } from './gameSettingHTML.js';

const html = String.raw;

class GameSettingDetailedComponent {
	template(initial, type) {
		this.initial = initial;
		this.data = deepCopy(initial);
		this.type = type;

		const { score, level } = createScoreAndLevelConfig(this.data);
		const { paddleColor, ballColor } = createColorConfig(this.data.color);
		const horizontalButton = createButtons();

		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container width-66">
						${createButtonSection('승점', score)}
						${createButtonSection('난이도', level)}
						${createColorSection(paddleColor, ballColor, this.data.color)}
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
		this.data.total_score = 2;
		this.data.level = 2;
		this.data.color.paddle = '#5AD7FF';
		this.data.color.ball = '#FFD164';
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
		if (!(this.type === 'local' || this.type === 'online')) return;

		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		confirmButton.addEventListener('click', () => {
			let setting = '';

			if (this.data.battle_mode === 1) {
				setting = this.type === 'local' ? 'gameSetting' : 'onlineSetting';
			} else if (this.data.battle_mode === 2) {
				setting =
					this.type === 'local'
						? 'gameSettingTournament'
						: 'onlineSettingTournament';
			}
			if (setting) changeUrlData(setting, this.data);
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

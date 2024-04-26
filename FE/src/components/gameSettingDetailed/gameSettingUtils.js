import HorizontalButton from '../HorizontalButton.js';

export function deepCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

// ------------------------------------------------------------------------

function createConfig(texts, classesPrefix, selectedIndices) {
	return texts.map((text, index) => ({
		text,
		classes: `${classesPrefix}${selectedIndices === index + 1 ? ' selected' : ''}`
	}));
}

export function createScoreAndLevelConfig(data) {
	const scoreTexts = ['5', '10', '15'];
	const levelTexts = ['쉬움', '보통', '어려움'];

	return {
		score: new HorizontalButton(
			createConfig(scoreTexts, 'button-select', data.total_score),
			'54rem'
		),
		level: new HorizontalButton(
			createConfig(levelTexts, 'button-select', data.level),
			'54rem'
		)
	};
}

// ------------------------------------------------------------------------

function createButtonConfigs(buttonTexts, classes) {
	return buttonTexts.map((text) => ({ text, classes }));
}

export function createButtons() {
	const buttonTexts = ['초기화', '완료'];
	const buttonClasses = 'button-reset-complete head_blue_neon_15 blue_neon_10';
	return new HorizontalButton(
		createButtonConfigs(buttonTexts, buttonClasses),
		'51rem'
	);
}

// ------------------------------------------------------------------------

function createColorPicker(colorCode, pickerId, buttonId) {
	const colorPicker = `<input type="color" id="${pickerId}" value="${colorCode}" class="color-picker-hidden"/>`;
	const colorDisplayButton = `<button class="button-select" id="${buttonId}" onclick="document.getElementById('${pickerId}').click()">${colorCode}</button>`;

	return { colorPicker, colorDisplayButton };
}

export function createColorConfig(color) {
	return {
		paddleColor: createColorPicker(
			color.paddle,
			'paddleColorPicker',
			'paddleColorButton'
		),
		ballColor: createColorPicker(
			color.ball,
			'ballColorPicker',
			'ballColorButton'
		)
	};
}

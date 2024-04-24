export function createColorPicker(colorCode, pickerId, buttonId) {
	const colorPicker = `<input type="color" id="${pickerId}" value="${colorCode}" class="color-picker-hidden"/>`;
	const colorDisplayButton = `<button class="button-select" id="${buttonId}" onclick="document.getElementById('${pickerId}').click()">${colorCode}</button>`;

	return { colorPicker, colorDisplayButton };
}

export function createButtonConfigs(buttonTexts, classes) {
	return buttonTexts.map((text) => ({ text, classes }));
}

export function createConfig(texts, classesPrefix, selectedIndices) {
	return texts.map((text, index) => ({
		text,
		classes: `${classesPrefix}${selectedIndices === index + 1 ? ' selected' : ''}`
	}));
}

export function deepCopy(src) {
	return JSON.parse(JSON.stringify(src));
}

const html = String.raw;

export function createButtonSection(title, component) {
	return html`
		<div class="horizontal-button-container activate-button width-66">
			<p class="text-subtitle-1">${title}</p>
			<div>${component.template()}</div>
		</div>
	`;
}

function createColorPickerSection(title, colorComponent) {
	return html`
		<div class="horizontal-button-container width-28">
			<p class="text-subtitle-1">${title}</p>
			<div class="horizontal-button-container">
				${colorComponent.colorPicker}${colorComponent.colorDisplayButton}
			</div>
		</div>
	`;
}

function createColorDisplay(type, color) {
	return html`
		<div
			class="color-display-${type}"
			style="background-color: ${color};
			box-shadow: 0rem 0rem 1.5rem 0rem ${color}, 0rem 0rem 1.5rem 0rem ${color};"
		></div>
	`;
}

export function createColorSection(paddleColor, ballColor, color) {
	return html`
		<div class="horizontal-button-container width-66">
			<div class="vertical-button-container height-25">
				${createColorPickerSection('패들색', paddleColor)}
				${createColorPickerSection('공색', ballColor)}
			</div>
			<div class="color-display-back">
				${createColorDisplay('paddle', color.paddle)}
				${createColorDisplay('ball', color.ball)}
			</div>
		</div>
	`;
}

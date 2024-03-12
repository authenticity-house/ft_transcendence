const html = String.raw;

class VerticalSmallButton {
	constructor(buttonConfigs, height) {
		this.buttonConfigs = buttonConfigs;
		this.height = height;
	}

	template() {
		const buttonsHtml = this.buttonConfigs
			.map((config) => {
				const fullClass = `button-small ${config.classes}`;
				return html` <button class="${fullClass}">${config.text}</button> `;
			})
			.join('');
		return html`
			<div class="vertical-button-container" style="width: ${this.width};">
				${buttonsHtml}
			</div>
		`;
	}
}

export default VerticalSmallButton;

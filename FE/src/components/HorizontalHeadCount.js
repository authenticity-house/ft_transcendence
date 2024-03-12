const html = String.raw;

class HorizontalHeadCount {
	constructor(buttonConfigs, width) {
		this.buttonConfigs = buttonConfigs;
		this.width = width;
	}

	template() {
		const buttonsHtml = this.buttonConfigs
			.map((config) => {
				const fullClass = `button-head-count ${config.classes || ''}`;
				return html`<button class="${fullClass}">${config.text}</button>`;
			})
			.join('');

		return html`
			<div class="horizontal-button-container" style="width: ${this.width};">
				${buttonsHtml}
			</div>
		`;
	}
}

export default HorizontalHeadCount;

const html = String.raw;

class VerticalSmallButton {
	constructor(textL, textR) {
		this.textL = textL;
		this.textR = textR;
	}

	template() {
		return html`
			<div class="head-count-container">
				<button class="button-head-count">${this.textL}</button>
				<button class="button-head-count">${this.textR}</button>
			</div>
		`;
	}
}

export default VerticalSmallButton;

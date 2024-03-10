const html = String.raw;

class BoldTitle {
	constructor(text) {
		this.text = text;
	}

	template() {
		return html`
			<div class="bold-title">
				<span class="display-medium48 yellow_neon_10"> ${this.text} </span>
			</div>
		`;
	}
}

export default BoldTitle;

const html = String.raw;

class BoldTitle {
	constructor(text, color) {
		this.text = text;
		this.color = color;
	}

	template() {
		if (this.color === 'yellow') {
			return html`
				<div class="bold-title">
					<span class="display-medium48 yellow_neon_10"> ${this.text} </span>
				</div>
			`;
		}
		return html`
			<div class="bold-title">
				<span class="display-medium48 pink_neon_10"> ${this.text} </span>
			</div>
		`;
	}
}

export default BoldTitle;

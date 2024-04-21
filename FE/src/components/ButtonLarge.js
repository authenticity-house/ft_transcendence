const html = String.raw;

class ButtonLarge {
	constructor(text) {
		this.text = text;
	}

	template() {
		return html`
			<button
				type="button"
				class="btn button-large head_blue_neon_15 blue_neon_10"
			>
				${this.text}
			</button>
		`;
	}
}

export default ButtonLarge;

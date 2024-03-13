const html = String.raw;

class ButtonLarge {
	constructor(text, disabled) {
		this.text = text;
		this.disabled = disabled;
	}

	template() {
		if (this.disabled === true) {
			return html`
				<button
					type="button"
					class="btn disabled button-large head_blue_neon_15 blue_neon_10"
				>
					${this.text}
				</button>
			`;
		}
		return html`
			<button type="button" class="button-large head_blue_neon_15 blue_neon_10">
				${this.text}
			</button>
		`;
	}
}

export default ButtonLarge;

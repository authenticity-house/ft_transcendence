const html = String.raw;

class ButtonExtraLarge {
	constructor(text, color) {
		this.text = text;
		this.borderShadow = `head_${color}_neon_15`;
		this.textShadow = `${color}_neon_10`;
	}

	template() {
		return html`
			<button
				type="button"
				class="btn button-extra-large 
				${this.borderShadow} ${this.textShadow} display-light28"
			>
				${this.text}
			</button>
		`;
	}
}

export default ButtonExtraLarge;

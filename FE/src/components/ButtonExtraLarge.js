const html = String.raw;

class ButtonExtraLarge {
	constructor(text, color) {
		this.text = text;
		this.color = color;
		this.updateProperties();
	}

	updateProperties() {
		this.borderShadow = `head_${this.color}_neon_15`;
		this.textShadow = `${this.color}_neon_10`;
	}

	updateTextAndColor(newText, newColor) {
		this.text = newText;
		this.color = newColor;
		this.updateProperties();
		this.updateButton();
	}

	template() {
		return html`
			<button
				type="button"
				class="btn button-extra-large ${this.borderShadow} ${this
					.textShadow} display-light28"
			>
				${this.text}
			</button>
		`;
	}

	updateButton() {
		const button = document.querySelector('.button-extra-large');
		if (button) {
			button.className = `btn button-extra-large ${this.borderShadow} ${this.textShadow} display-light28`;
			button.textContent = this.text;
		}
	}
}

export default ButtonExtraLarge;

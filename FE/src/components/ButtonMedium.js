const html = String.raw;

class ButtonMedium {
	constructor(options) {
		this.text = options.text;
		this.type = options.type ? options.type : 'button';
	}

	template() {
		return html`
			<button class="button-medium head_blue_neon_15 blue_neon_10">
				${this.text}
			</button>
		`;
	}
}

export default ButtonMedium;

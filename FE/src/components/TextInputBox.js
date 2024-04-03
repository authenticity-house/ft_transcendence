const html = String.raw;

// {text: 'string', button: true}
class TextInputBox {
	constructor(options) {
		this.text = options.text; // string
		this.button = options.button; // boolean
		this.name = options.name ? options.name : 'default';

		this.type = options.type ? options.type : 'text';
		if (this.name === 'password') this.type = this.name;
	}

	template() {
		if (this.button === false) {
			return html`
				<div class="text-inputbox-container">
					<div class="text-container">
						<p class="display-medium20">${this.text}</p>
					</div>
					<input name=${this.name} type=${this.type} class="input-size" />
				</div>
			`;
		}
		return html`
			<div class="text-inputbox-button-container">
				<div class="text-button-container">
					<p class="display-medium20">${this.text}</p>
				</div>
				<div class="input-button-container">
					<input type="text" class="input-size" />
					<button class="input-button head_blue_neon_15">
						<p class="display-light24 blue_neon_10">중복확인</p>
					</button>
				</div>
			</div>
		`;
	}
}

export default TextInputBox;

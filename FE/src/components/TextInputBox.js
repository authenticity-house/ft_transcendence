const html = String.raw;

// {text: 'string', button: true}
class TextInputBox {
	constructor({ text, button, name, type = 'text' }) {
		this.text = text;
		this.button = button;
		this.name = name;

		this.type = ['password', 'password_confirm'].includes(name)
			? 'password'
			: type;
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
					<input name=${this.name} type=${this.type} class="input-size" />
					<button class="input-button head_blue_neon_15">
						<p class="display-light24 blue_neon_10">중복확인</p>
					</button>
				</div>
			</div>
		`;
	}
}

export default TextInputBox;

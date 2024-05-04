const html = String.raw;

// {text: 'string', button: true}
class TextInputBox {
	constructor({ text, button, name, type = 'text', modify }) {
		this.text = text;
		this.button = button;
		this.name = name;

		this.type = ['password', 'password1', 'password2', 'old_password'].includes(
			name
		)
			? 'password'
			: type;

		this.modify = modify;
	}

	template() {
		if (this.modify) {
			return html`
				<div class="modify-text-inputbox-container">
					<div class="modify-text-container">
						<p class="display-medium16">${this.text}</p>
					</div>
					<input
						name=${this.name}
						type=${this.type}
						class="modify-input-size"
						autocomplete="off"
					/>
				</div>
			`;
		}
		if (this.button === false) {
			return html`
				<div class="text-inputbox-container">
					<div class="text-container">
						<p class="display-medium20">${this.text}</p>
					</div>
					<input
						name=${this.name}
						type=${this.type}
						autocomplete="off"
						class="input-size"
					/>
				</div>
			`;
		}
		return html`
			<div class="text-inputbox-button-container">
				<div class="text-button-container">
					<p class="display-medium20">${this.text}</p>
				</div>
				<div class="input-button-container">
					<input
						name=${this.name}
						type=${this.type}
						autocomplete="off"
						class="input-size"
					/>
					<button
						class="input-button head_blue_neon_15"
						id="check-${this.name}"
					>
						<p class="display-light24 blue_neon_10">중복확인</p>
					</button>
				</div>
			</div>
		`;
	}
}

export default TextInputBox;

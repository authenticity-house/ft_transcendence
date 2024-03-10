const html = String.raw;

class ButtonSmall {
	constructor(text) {
		this.text = text;
	}

	template() {
		return html`
			<button class="button-small head_blue_neon_15 blue_neon_10">
				${this.text}
			</button>
		`;
	}
}

export default ButtonSmall;

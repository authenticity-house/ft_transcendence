const html = String.raw;

class ButtonBackArrow {
	template() {
		return html`
			<button class="button-back-arrow-box">
				<img src="image/back-arrow.svg" alt="back" style="width: 4rem" />
			</button>
		`;
	}
}

export default ButtonBackArrow;

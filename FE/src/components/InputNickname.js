const html = String.raw;

class InputNickname {
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}

	template() {
		return html`${Array.from(
			{ length: this.end - this.start + 1 },
			(_, i) => i + this.start
		)
			.map(
				(index) =>
					`<div class="input-nickname">
						<p class="text-light-15">${index}</p>
						<input type="text" class="input-nickname-box text-light-15"
						style="text-align:left" />
					</div>`
			)
			.join('')}`;
	}
}

export default InputNickname;

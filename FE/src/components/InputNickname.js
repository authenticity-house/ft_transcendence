const html = String.raw;

class InputNickname {
	constructor(index) {
		this.index = index;
	}

	containDiv(index) {
		let res = '';
		for (let i = 1; i <= index; i += 1) {
			res += `<div class="input-nickname">
								<p class="text-light-15">${i}</p>
								<input type="text" class="input-nickname-box text-light-15"
								style="text-align:left" />
							</div>`;
		}
		return res;
	}

	template() {
		return html` <p class="text-light-15">${this.index}</p>
			<input
				type="text"
				class="input-nickname-box text-light-15"
				style="text-align:left"
			/>`;
	}
}

export default InputNickname;

const html = String.raw;

class InputNickname {
	constructor(index) {
		this.index = index;
	}

	containDiv(index, nickname) {
		let res = '';
		const nicknames = nickname || []; // nicknames가 undefined 또는 null일 경우 빈 배열 사용
		let col1 = '';
		let col2 = '';

		for (let i = 1; i <= index; i += 1) {
			const nicknameValue = nicknames[i - 1] || '';
			const inputDiv = `<div class="input-nickname">
								<p class="text-light-15">${i}</p>
								<input type="text" class="input-nickname-box text-light-15"
								value="${nicknameValue}" maxlength="12" />
							</div>`;

			if (i <= 4) {
				col1 += inputDiv;
			} else if (i <= 8) {
				col2 += inputDiv;
			}
		}
		res += `<div class="input-nickname-col-1">${col1}</div>`;
		res += `<div class="input-nickname-col-2">${col2}</div>`;

		return res;
	}

	template() {
		return html` <p class="text-light-15">${this.index}</p>
			<input
				type="text"
				class="input-nickname-box text-light-15"
				maxlength="12"
			/>`;
	}
}

export default InputNickname;

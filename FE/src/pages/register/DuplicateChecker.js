import apiEndpoints from '../../constants/apiConfig.js';
import { showModalWithContent } from '../../components/modal/modalUtils.js';

export class DuplicateChecker {
	constructor() {
		this.isDuplicateChecked = {
			username: false,
			email: false,
			nickname: false
		};
	}

	toggleButtonState(button, isWarning) {
		const method = isWarning ? 'add' : 'remove';
		button.classList[method]('head_blue_neon_15');
		button.querySelector('p').classList[method]('blue_neon_10');
	}

	resetDuplicateCheck(inputName) {
		this.isDuplicateChecked[inputName] = false;
		this.toggleButtonState(document.getElementById(`check-${inputName}`), true);
	}

	addInputChangeEventListener(inputName) {
		const inputElement = document.querySelector(`input[name="${inputName}"]`);

		if (inputElement) {
			inputElement.addEventListener(
				'input',
				() => this.resetDuplicateCheck(inputName),
				{ once: true }
			);
		}
	}

	checkDuplicate(inputName, modalMessage) {
		const inputElement = document.querySelector(`input[name="${inputName}"]`);
		const checkButton = document.getElementById(`check-${inputName}`);

		const inputValue = inputElement.value;

		if (!inputValue) return;

		fetch(`${apiEndpoints.REGISTER_CHECK_URL}${inputName}=${inputValue}`, {
			method: 'GET'
		})
			.then((response) => {
				if (response.ok) {
					this.toggleButtonState(checkButton, false);
					this.isDuplicateChecked[inputName] = true;

					this.addInputChangeEventListener(inputName);
				} else if (response.status === 409) {
					showModalWithContent(
						'registerDupModal',
						'add-modal-text',
						modalMessage
					);
					this.toggleButtonState(checkButton, true);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
			});
	}

	// 각 중복체크 플래그를 false로 초기화
	resetDuplicateCheckStatus() {
		Object.keys(this.isDuplicateChecked).forEach((key) => {
			this.isDuplicateChecked[key] = false;
		});
	}
}

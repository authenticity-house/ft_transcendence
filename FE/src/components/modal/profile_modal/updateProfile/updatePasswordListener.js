import { updateProfileAPI } from './updateProfileAPI.js';
import { areAllFieldsFilled } from '../../../../utils/areAllFieldsFilled.js';
import { passwordValidCheck } from '../../../../pages/register/registerValidCheck.js';
import { showMessage } from './updateProfileUtils.js';

const Messages = {
	PASSWORD_CHANGE_CANCELLED: '비밀번호 변경이 취소되었습니다.',
	PASSWORD_CHANGE_COMPLETED: '비밀번호 변경이 완료되었습니다.',
	FILL_ALL_FIELDS: '모두 입력해주세요.',
	INCORRECT_OLD_PASSWORD: '기존 비밀번호가 맞지 않습니다.'
};

function emptyInputFields(container) {
	const inputElements = container.querySelectorAll('input');
	inputElements.forEach((input) => {
		const inputField = input;
		inputField.value = '';
	});
}

function togglePasswordChangeUI(isVisible) {
	const modifyPasswordContainer = document.querySelector(
		'.modify-password-form'
	);
	const modifyPasswordButton = document.querySelector(
		'.password-button-container button'
	);

	modifyPasswordContainer.style.display = isVisible ? 'none' : 'flex';
	modifyPasswordButton.classList.toggle('disabled', !isVisible);
}

async function submitPasswordChange() {
	const confirmForm = document.querySelector('.modify-password-form');
	const passwordErrorMsg = document.querySelector('.modify-password-error-msg');

	const formData = new FormData(confirmForm);

	if (!areAllFieldsFilled(formData)) {
		passwordErrorMsg.innerText = Messages.FILL_ALL_FIELDS;
		return;
	}
	const invalidPass = passwordValidCheck();
	if (invalidPass) {
		passwordErrorMsg.innerHTML = invalidPass;
		return;
	}

	const updatePasswordSuccess = await updateProfileAPI(formData);

	if (updatePasswordSuccess) {
		togglePasswordChangeUI(true);
		emptyInputFields(confirmForm);
		passwordErrorMsg.innerHTML = '';
		showMessage('.modify-password-msg', Messages.PASSWORD_CHANGE_COMPLETED);
	} else {
		emptyInputFields(confirmForm);
		passwordErrorMsg.innerText = Messages.INCORRECT_OLD_PASSWORD;
	}
}

export default function updatePasswordListener() {
	const modifyPasswordButton = document.querySelector(
		'.password-button-container button'
	);
	const modifyCancelPasswordButton = document.querySelector('#cancel-pw');
	const modifySubmitPasswordButton = document.querySelector('#submit-pw');
	const modifyPasswordContainer = document.querySelector(
		'.modify-password-form'
	);
	const passwordErrorMsg = document.querySelector('.modify-password-error-msg');

	modifyPasswordButton.addEventListener('click', () =>
		togglePasswordChangeUI(false)
	);

	modifyCancelPasswordButton.addEventListener('click', () => {
		emptyInputFields(modifyPasswordContainer);
		passwordErrorMsg.innerHTML = '';
		showMessage('.modify-password-msg', Messages.PASSWORD_CHANGE_CANCELLED);
		togglePasswordChangeUI(true);
	});

	modifySubmitPasswordButton.addEventListener('click', submitPasswordChange);
}

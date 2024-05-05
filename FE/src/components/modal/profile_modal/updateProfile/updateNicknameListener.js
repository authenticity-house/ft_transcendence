import { nicknameValidCheck } from '../../../../pages/register/registerValidCheck.js';
import { updateProfileAPI } from './updateProfileAPI.js';

const ERROR_MESSAGES = {
	EMPTY_NICKNAME: '변경할 닉네임을 입력해주세요.',
	INVALID_NICKNAME:
		'2~12자의 영문 소문자, 숫자와<br />특수기호(_),(-)만 사용 가능합니다.',
	DUPLICATE_NICKNAME: '중복된 닉네임입니다.'
};

function showError(message, elements) {
	// eslint-disable-next-line no-param-reassign
	elements.modifyErrorMsg.innerHTML = message;
}

function clearError(elements) {
	// eslint-disable-next-line no-param-reassign
	elements.modifyErrorMsg.innerText = '';
}

function toggleNicknameEditUI(isEditing, elements, nickname = '') {
	const { modifyNicknameButton, modifyCancelButton, input, span } = elements;

	document.querySelector('.my-info-content-name-modify-input').value = '';
	if (isEditing) {
		span.style.display = 'none';
		input.style.display = 'block';
		modifyCancelButton.style.display = 'block';
		modifyNicknameButton.classList.add('modify');
	} else {
		span.innerText = nickname;
		span.style.display = 'block';
		input.style.display = 'none';
		modifyCancelButton.style.display = 'none';
		modifyNicknameButton.classList.remove('modify');
	}
}

async function updateNickname(elements) {
	const newNickname = elements.input.value;
	if (newNickname === '') {
		showError(ERROR_MESSAGES.EMPTY_NICKNAME, elements);
		return;
	}
	if (!nicknameValidCheck(newNickname)) {
		showError(ERROR_MESSAGES.INVALID_NICKNAME, elements);
		return;
	}

	const formData = new FormData();
	formData.append('nickname', newNickname);

	const returnNickname = await updateProfileAPI(formData);
	if (returnNickname) {
		toggleNicknameEditUI(false, elements, returnNickname);
		clearError(elements);
		document.querySelector('.user-profile-nickname').innerText = returnNickname;
	} else {
		showError(ERROR_MESSAGES.DUPLICATE_NICKNAME, elements);
	}
}

export default function updateNicknameListener() {
	const modifyNickname = document.querySelector('.my-info-content-name');
	const elements = {
		modifyNickname,
		modifyNicknameButton: document.getElementById('edit-name'),
		modifyCancelButton: document.getElementById('edit-name-cancel'),
		input: modifyNickname.querySelector('input'),
		span: modifyNickname.querySelector('span'),
		modifyErrorMsg: document.querySelector('.modify-name-error-msg')
	};

	elements.modifyNicknameButton.addEventListener('click', () => {
		if (elements.modifyNicknameButton.classList.contains('modify')) {
			updateNickname(elements);
		} else {
			toggleNicknameEditUI(true, elements);
		}
	});

	elements.modifyCancelButton.addEventListener('click', () => {
		clearError(elements);
		toggleNicknameEditUI(false, elements, elements.span.innerText);
	});
}

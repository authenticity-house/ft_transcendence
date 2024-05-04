import apiEndpoints from '../../../constants/apiConfig.js';
import { getCookie } from '../../../utils/getCookie.js';
import { nicknameValidCheck } from '../../../pages/register/registerValidCheck.js';

async function updateProfileAPI(value) {
	const csrfToken = getCookie('csrftoken');
	const formData = new FormData();

	if (typeof value === 'string') {
		formData.append('nickname', value);
	}

	try {
		const response = await fetch(apiEndpoints.UPDATE_USER_URL, {
			method: 'PATCH',
			headers: {
				'X-CSRFToken': csrfToken
			},
			body: formData
		});

		const data = await response.json();
		const { status, ok } = response;

		if (ok) {
			return data.nickname;
		}
		if (status === 400) {
			return null;
		}
	} catch (error) {
		console.error('Error:', error);
	}
	return null;
}

function toggleNicknameEditUI(isEditing, elements, nickname = '') {
	const { modifyNicknameButton, modifyCancelButton, input, span } = elements;

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

export function updateNicknameListener() {
	const modifyNickname = document.querySelector('.my-info-content-name');
	const elements = {
		modifyNickname,
		modifyNicknameButton: document.getElementById('edit-name'),
		modifyCancelButton: document.getElementById('edit-name-cancel'),
		input: modifyNickname.querySelector('input'),
		span: modifyNickname.querySelector('span'),
		modifyErrorMsg: document.querySelector('.modify-name-error-msg')
	};
	let { nickName } = elements.span.innerText;

	elements.modifyNicknameButton.addEventListener('click', async () => {
		nickName = elements.span.innerText;
		if (elements.modifyNicknameButton.classList.contains('modify')) {
			const newNickname = elements.input.value;

			if (newNickname === '') {
				elements.modifyErrorMsg.innerHTML = '변경할 닉네임을 입력해주세요.';
				return;
			}
			if (!nicknameValidCheck(newNickname)) {
				elements.modifyErrorMsg.innerHTML =
					'2~12자의 영문 소문자, 숫자와<br />특수기호(_),(-)만 사용 가능합니다.';
				return;
			}

			const returnNickname = await updateProfileAPI(newNickname);
			if (returnNickname) {
				nickName = returnNickname;
				toggleNicknameEditUI(false, elements, returnNickname);
				elements.modifyErrorMsg.innerHTML = '';
			} else {
				elements.modifyErrorMsg.innerHTML = '중복된 닉네임입니다.';
			}
		} else {
			toggleNicknameEditUI(true, elements);
		}
	});

	elements.modifyCancelButton.addEventListener('click', () => {
		elements.modifyErrorMsg.innerHTML = '';
		toggleNicknameEditUI(false, elements, nickName);
	});
}

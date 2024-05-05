import { nicknameValidCheck } from '../../../../pages/register/registerValidCheck.js';
import { updateProfileAPI } from './updateProfileAPI.js';

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
	let { nickName } = elements.span.innerText;

	elements.modifyNicknameButton.addEventListener('click', async () => {
		nickName = elements.span.innerText;
		if (elements.modifyNicknameButton.classList.contains('modify')) {
			const newNickname = elements.input.value;

			if (newNickname === '') {
				elements.modifyErrorMsg.innerText = '변경할 닉네임을 입력해주세요.';
				return;
			}
			if (!nicknameValidCheck(newNickname)) {
				elements.modifyErrorMsg.innerHTML =
					'2~12자의 영문 소문자, 숫자와<br />특수기호(_),(-)만 사용 가능합니다.';
				return;
			}
			const formData = new FormData();
			formData.append('nickname', newNickname);
			const returnNickname = await updateProfileAPI(formData);
			if (returnNickname) {
				nickName = returnNickname;

				const onlineNickname = document.querySelector('.user-profile-nickname');
				if (onlineNickname) onlineNickname.innerText = returnNickname;

				toggleNicknameEditUI(false, elements, returnNickname);
				elements.modifyErrorMsg.innerText = '';
			} else {
				elements.modifyErrorMsg.innerText = '중복된 닉네임입니다.';
			}
		} else {
			toggleNicknameEditUI(true, elements);
		}
	});

	elements.modifyCancelButton.addEventListener('click', () => {
		elements.modifyErrorMsg.innerText = '';
		document.querySelector('.my-info-content-name-modify-input').value = '';
		toggleNicknameEditUI(false, elements, nickName);
	});
}

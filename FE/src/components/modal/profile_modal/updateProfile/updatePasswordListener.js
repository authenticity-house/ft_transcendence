import { updateProfileAPI } from './updateProfileAPI.js';

export default function updatePasswordListener() {
	// 비밀번호 변경 UI
	const passwordContainer = document.querySelector(
		'.password-button-container'
	);
	const modifyPasswordContainer = document.querySelector(
		'.modify-password-form'
	);
	const modifyPasswordButton = passwordContainer.querySelector('button');
	const modifyCancelPasswordButton = document.getElementById('cancel-pw');
	const modifySubmitPasswordButton = document.getElementById('submit-pw');

	// 비밀번호 변경 클릭 버튼
	modifyPasswordButton.addEventListener('click', () => {
		//passwordContainer.style.display = 'none';
		modifyPasswordButton.classList.add('disabled');
		modifyPasswordContainer.style.display = 'flex';
	});

	// 비밀번호 변경 취소 버튼
	modifyCancelPasswordButton.addEventListener('click', () => {
		const inputElementAll = modifyPasswordContainer.querySelectorAll('input');
		inputElementAll.forEach((input) => {
			const inputField = input;
			inputField.value = '';
		});
		passwordContainer.style.display = 'flex';
		modifyPasswordContainer.style.display = 'none';
		modifyPasswordButton.classList.remove('disabled');
	});
	// + 비밀번호 변경 확인 API 추가 할 곳
	modifySubmitPasswordButton.addEventListener('click', () => {
		// const confirmForm = document.getElementById('modify-password-form');
		// const formData = new FormData(confirmForm);

		// const passCheck = passwordValidCheck(); // 유효하지 않을 경우 에러 메시지 반환
		//	if (passCheck) {

		// 변경이 가능하면, res.ok 해당 코드 실행
		passwordContainer.style.display = 'flex';
		modifyPasswordContainer.style.display = 'none';
		modifyPasswordButton.classList.remove('disabled');
	});
}

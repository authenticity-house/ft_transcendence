import { changeUrl } from '../../index.js';
import BoldTitle from '../../components/BoldTitle.js';
import TextInputBox from '../../components/TextInputBox.js';
import ButtonMedium from '../../components/ButtonMedium.js';
import ButtonBackArrow from '../../components/ButtonBackArrow.js';
import { areAllFieldsFilled } from '../../utils/areAllFieldsFilled.js';

import { registerDupModal } from './registerDupModal.js';
import { registerModal } from './registerModal.js';
import { registerLoadingModal } from './registerLoadingModal.js';
import { registerFailModal } from './registerFailModal.js';

import { registerAPI } from './registerAPI.js';
import apiEndpoints from '../../constants/apiConfig.js';

import { showModal } from '../../components/modal/modalUtils.js';

const html = String.raw;

function updateModalContent(id, newContent) {
	const contentElement = document.getElementById(id);
	if (contentElement) {
		contentElement.innerHTML = newContent;
	}
}

function checkDuplicate(inputName, endpointUrl, modalId, modalMessage) {
	const inputElement = document.querySelector(`input[name="${inputName}"]`);
	const checkButton = document.getElementById(`check-${inputName}`);
	const checkbuttonText = checkButton.querySelector('p');

	const inputValue = inputElement.value;

	if (inputValue) {
		fetch(
			`${apiEndpoints[endpointUrl]}${inputName}=${encodeURIComponent(inputValue)}`
		)
			.then((response) => {
				if (response.ok) {
					// 사용가능
					console.log('사용가능');
					checkButton.classList.remove('head_blue_neon_15');

					checkbuttonText.classList.remove('blue_neon_10');
				} else if (response.status === 409) {
					// 중복됨
					console.log('중복됨');
					checkButton.classList.add('head_blue_neon_15');
					checkbuttonText.classList.add('blue_neon_10');

					updateModalContent(modalId, modalMessage);
					showModal('registerDupModal');
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
			});
	}
}

class RegisterPage {
	template() {
		const titleComponent = new BoldTitle('회원가입', 'yellow');
		const textInputBoxId = new TextInputBox({
			text: '아이디',
			button: true,
			name: 'username'
		});
		const textInputBoxPassword = new TextInputBox({
			text: '비밀번호',
			button: false,
			name: 'password1'
		});
		const textInputBoxPasswordCheck = new TextInputBox({
			text: '비밀번호 확인',
			button: false,
			name: 'password2'
		});
		const textInputBoxEmail = new TextInputBox({
			text: '이메일',
			button: true,
			name: 'email'
		});

		const textInputBoxNickname = new TextInputBox({
			text: '닉네임',
			button: true,
			name: 'nickname'
		});

		const confirmButton = new ButtonMedium({ text: '확인', name: 'submit' });
		const backButton = new ButtonBackArrow();

		return html`
			<div class="small-window head_white_neon_15">
				<div class="bold-title-no-padding gap-5">
					${titleComponent.register()}

					<div class="vertical-button-container height-66">
						<form id="resgister-confirm-form">
							<div class="bold-title-no-padding gap-1-6">
								${textInputBoxId.template()} ${textInputBoxPassword.template()}
								${textInputBoxPasswordCheck.template()}
								${textInputBoxEmail.template()}
								${textInputBoxNickname.template()}
							</div>
						</form>
						<div class="register-confirm">${confirmButton.template()}</div>
					</div>
				</div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
			${registerDupModal()} ${registerFailModal()} ${registerModal()}
			${registerLoadingModal()}
		`;
	}

	addEventListeners() {
		const idCheck = document.getElementById('check-username');
		idCheck.addEventListener('click', (e) => {
			e.preventDefault();
			checkDuplicate(
				'username',
				'REGISTER_CHECK_URL',
				'add-modal-text',
				'중복된 아이디입니다.<br />다시 입력해주세요.'
			);
		});

		const emailCheck = document.getElementById('check-email');
		emailCheck.addEventListener('click', (e) => {
			e.preventDefault();
			const inputValue = document.querySelector('input[name="email"]').value;
			console.log(inputValue);
			alert('사용 가능한 이메일');
		});

		const nicknameCheck = document.getElementById('check-nickname');
		nicknameCheck.addEventListener('click', (e) => {
			e.preventDefault();
			const inputValue = document.querySelector('input[name="nickname"]').value;
			console.log(inputValue);
			alert('사용 가능한 닉네임');
		});

		// --------------------------------------------------------------------------------

		// --------------------------------------------------------------------------------

		const confirmForm = document.getElementById('resgister-confirm-form');
		const confirm = document.querySelector('.register-confirm');
		confirm.addEventListener('click', (e) => {
			e.preventDefault();

			const formData = new FormData(confirmForm);

			if (!areAllFieldsFilled(formData)) {
				alert('모두 입력해주세요.');
			} else {
				registerAPI(formData);
			}
		});

		// --------------------------------------------------------------------------------

		const back = document.querySelector('.button-back-in-window');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new RegisterPage();

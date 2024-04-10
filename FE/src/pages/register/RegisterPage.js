import { changeUrl } from '../../index.js';
import BoldTitle from '../../components/BoldTitle.js';
import TextInputBox from '../../components/TextInputBox.js';
import ButtonMedium from '../../components/ButtonMedium.js';
import ButtonBackArrow from '../../components/ButtonBackArrow.js';
import { formDataToJson } from '../../utils/formDataToJson.js';
import { areAllFieldsFilled } from '../../utils/areAllFieldsFilled.js';

import { registerModal } from './registerModal.js';
import { registerLoadingModal } from './registerLoadingModal.js';
import { registerFailModal } from './registerFailModal.js';
import { hideModal, showModal } from '../../components/modal/modalUtils.js';

import apiEndpoints from '../../constants/apiConfig.js';

const html = String.raw;

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
			${registerFailModal()} ${registerModal()} ${registerLoadingModal()}
		`;
	}

	addEventListeners() {
		const idCheck = document.getElementById('check-username');
		idCheck.addEventListener('click', (e) => {
			e.preventDefault();
			const inputValue = document.querySelector('input[name="username"]').value;
			console.log(inputValue);
			alert('사용 가능한 아이디');
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
				const payload = formDataToJson(formData);
				console.log('Form data:', payload);
				showModal('registerLoadingModal');

				fetch(apiEndpoints.REGISTRATION_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: payload
				})
					.then((res) => {
						let modalToShow;

						// 200 : OK
						if (res.ok) {
							if (res.status === 201) {
								// 201 : Created
								modalToShow = 'registerModal';
							}
						}
						if (res.status === 400 || res.status === 403) {
							// 비밀번호 다름, 아이디/닉네임/이메일 중복
							modalToShow = 'registerFailModal';
						}
						if (modalToShow) {
							hideModal('registerLoadingModal', () => {
								showModal(modalToShow);
							});
							return res.json();
						}
						throw new Error('Error');
					})
					.then((data) => console.log(data))
					.catch((error) => console.error('Error:', error));
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

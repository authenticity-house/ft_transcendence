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

import {
	showModal,
	updateModalContent
} from '../../components/modal/modalUtils.js';

import {
	idValidCheck,
	emailValidCheck,
	nicknameValidCheck
} from './registerValidCheck.js';

const html = String.raw;

// ------------------------------------------------------------------

const isDuplicateChecked = {
	username: false,
	email: false,
	nickname: false
};

function addInputChangeEventListener(inputName) {
	const inputElement = document.querySelector(`input[name="${inputName}"]`);
	const checkButton = document.getElementById(`check-${inputName}`);
	const checkbuttonText = checkButton.querySelector('p');

	if (inputElement) {
		inputElement.addEventListener(
			'input',
			() => {
				isDuplicateChecked[inputName] = false;
				checkButton.classList.add('head_blue_neon_15');
				checkbuttonText.classList.add('blue_neon_10');
			},
			{ once: true } // 이벤트리스너 한번만 실행
		);
	}
}

function checkDuplicate(inputName, endpointUrl, modalMessage) {
	const inputElement = document.querySelector(`input[name="${inputName}"]`);
	const checkButton = document.getElementById(`check-${inputName}`);
	const checkbuttonText = checkButton.querySelector('p');

	const inputValue = inputElement.value;

	if (inputValue) {
		fetch(
			`${apiEndpoints[endpointUrl]}${inputName}=${inputValue}`,
			{ method: 'GET' }
			// encodeURIComponent : URI로 데이터를 전달하기 위해서 문자열을 인코딩
		)
			.then((response) => {
				if (response.ok) {
					console.log('사용가능');

					checkButton.classList.remove('head_blue_neon_15');
					checkbuttonText.classList.remove('blue_neon_10');

					isDuplicateChecked[inputName] = true;

					addInputChangeEventListener(inputName);
				} else if (response.status === 409) {
					console.log('중복됨');

					updateModalContent('add-modal-text', modalMessage);
					showModal('registerDupModal');

					checkButton.classList.add('head_blue_neon_15');
					checkbuttonText.classList.add('blue_neon_10');
					isDuplicateChecked[inputName] = false;
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
			});
	}
}

// -----------------------------------------------------------------------------

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
			if (isDuplicateChecked.username) return;
			// 아이디 형식 확인
			const inputElement = document.querySelector(`input[name="username"]`);
			if (!idValidCheck(inputElement.value)) {
				updateModalContent(
					'add-modal-text',
					'아이디 형식이 맞지 않습니다.<br />4~12자의 영문 소문자, 숫자와<br />특수기호(_),(-)만 사용 가능합니다.'
				);
				showModal('registerDupModal');
			} else
				checkDuplicate(
					'username',
					'REGISTER_CHECK_URL',
					'중복된 아이디입니다.<br />다시 입력해주세요.'
				);
		});

		const emailCheck = document.getElementById('check-email');
		emailCheck.addEventListener('click', (e) => {
			e.preventDefault();
			if (isDuplicateChecked.email) return;

			// 이메일 형식 확인
			const inputElement = document.querySelector(`input[name="email"]`);
			if (!emailValidCheck(inputElement.value)) {
				updateModalContent(
					'add-modal-text',
					'이메일 형식이 맞지 않습니다.<br />다시 입력해주세요.'
				);
				showModal('registerDupModal');
			} else
				checkDuplicate(
					'email',
					'REGISTER_CHECK_URL',
					'중복된 이메일입니다.<br />다시 입력해주세요.'
				);
		});

		const nicknameCheck = document.getElementById('check-nickname');
		nicknameCheck.addEventListener('click', (e) => {
			e.preventDefault();
			if (isDuplicateChecked.nickname) return;
			// 닉네임 형식 확인
			const inputElement = document.querySelector(`input[name="nickname"]`);
			if (!nicknameValidCheck(inputElement.value)) {
				updateModalContent(
					'add-modal-text',
					'닉네임 형식이 맞지 않습니다.<br />2~12자의 영문 소문자, 숫자와<br />특수기호(_),(-)만 사용 가능합니다.'
				);
				showModal('registerDupModal');
			} else
				checkDuplicate(
					'nickname',
					'REGISTER_CHECK_URL',
					'중복된 닉네임입니다.<br />다시 입력해주세요.'
				);
		});

		// --------------------------------------------------------------------------------

		const confirmForm = document.getElementById('resgister-confirm-form');
		const confirm = document.querySelector('.register-confirm');
		confirm.addEventListener('click', (e) => {
			e.preventDefault();

			const formData = new FormData(confirmForm);

			if (!areAllFieldsFilled(formData)) {
				updateModalContent('add-modal-text', '모두 입력해주세요.');
				showModal('registerDupModal');
			} else if (!isDuplicateChecked.username) {
				updateModalContent('add-modal-text', '아이디 중복체크를 완료해주세요.');
				showModal('registerDupModal');
			} else if (!isDuplicateChecked.email) {
				updateModalContent('add-modal-text', '이메일 중복체크를 완료해주세요.');
				showModal('registerDupModal');
			} else if (!isDuplicateChecked.nickname) {
				updateModalContent('add-modal-text', '닉네임 중복체크를 완료해주세요.');
				showModal('registerDupModal');
			} else {
				registerAPI(formData);
				Object.keys(isDuplicateChecked).forEach((key) => {
					isDuplicateChecked[key] = false;
				});
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

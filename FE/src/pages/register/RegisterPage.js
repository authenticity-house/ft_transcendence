import BoldTitle from '../../components/BoldTitle.js';
import TextInputBox from '../../components/TextInputBox.js';
import ButtonMedium from '../../components/ButtonMedium.js';
import ButtonBackArrow from '../../components/ButtonBackArrow.js';
import { showModalWithContent } from '../../components/modal/modalUtils.js';

import { changeUrl } from '../../index.js';
import { areAllFieldsFilled } from '../../utils/areAllFieldsFilled.js';

import { registerAPI } from './registerAPI.js';
import {
	idValidCheck,
	emailValidCheck,
	nicknameValidCheck,
	passwordValidCheck
} from './registerValidCheck.js';
import { DuplicateChecker } from './DuplicateChecker.js';

import { registerDupModal } from './modals/registerDupModal.js';
import { registerModal } from './modals/registerModal.js';
import { registerLoadingModal } from './modals/registerLoadingModal.js';
import { registerFailModal } from './modals/registerFailModal.js';

// -----------------------------------------------------------------------------
const html = String.raw;

class RegisterPage {
	constructor() {
		this.duplicateChecker = new DuplicateChecker();
		this.setupUI();
	}

	createTextInputBoxes() {
		const boxesConfig = [
			{ text: '아이디', button: true, name: 'username' },
			{ text: '비밀번호', button: false, name: 'password1' },
			{ text: '비밀번호 확인', button: false, name: 'password2' },
			{ text: '이메일', button: true, name: 'email' },
			{ text: '닉네임', button: true, name: 'nickname' }
		];
		return boxesConfig.map((config) => new TextInputBox(config));
	}

	setupUI() {
		this.titleComponent = new BoldTitle('회원가입', 'yellow');
		this.confirmButton = new ButtonMedium({ text: '확인', name: 'submit' });
		this.backButton = new ButtonBackArrow();
		this.textInputBoxes = this.createTextInputBoxes();
	}

	// ----------------------------------------------------------------------------------------

	template() {
		return html`
			<div class="small-window head_white_neon_15">
				<div class="bold-title-no-padding gap-5">
					${this.titleComponent.register()}

					<div class="vertical-button-container height-66">
						<form id="resgister-confirm-form">
							<div class="bold-title-no-padding gap-1-6">
								${this.textInputBoxes.map((input) => input.template()).join('')}
							</div>
						</form>
						<div class="register-confirm">${this.confirmButton.template()}</div>
					</div>
				</div>
				<div class="button-back-in-window">${this.backButton.template()}</div>
			</div>
			${registerDupModal()} ${registerFailModal()} ${registerModal()}
			${registerLoadingModal()}
		`;
	}
	// ----------------------------------------------------------------------------------------

	// 각 중복확인에 대한 이벤트리스너 추가
	// 유효성 체크와 중복 체크
	setupDuplicateCheck(
		inputName,
		validCheckFunction,
		errorMessage,
		duplicateMessage
	) {
		const checkButton = document.querySelector(`#check-${inputName}`);
		const inputElement = document.querySelector(`input[name="${inputName}"]`);

		checkButton.addEventListener('click', (e) => {
			e.preventDefault();

			if (this.duplicateChecker.isDuplicateChecked[inputName]) return;

			// 유효성 체크
			if (!validCheckFunction(inputElement.value)) {
				showModalWithContent(
					'registerDupModal',
					'add-modal-text',
					errorMessage
				);
			} else {
				// 중복 체크
				this.duplicateChecker.checkDuplicate(inputName, duplicateMessage);
			}
		});
	}

	// ----------------------------------------------------------------------------------------

	// 회원가입 버튼 클릭 시 유효성 검사
	areAllFieldsValid(formData, fieldsToCheck) {
		// 모든 요소를 입력하지 않았을 경우
		if (!areAllFieldsFilled(formData)) {
			showModalWithContent(
				'registerDupModal',
				'add-modal-text',
				'모두 입력해주세요.'
			);
			return false;
		}

		// 중복체크가 완료되지 않은 요소를 체크해서 중복체크 요청
		const notCheck = fieldsToCheck.find(
			({ field }) => !this.duplicateChecker.isDuplicateChecked[field]
		);
		if (notCheck) {
			showModalWithContent(
				'registerDupModal',
				'add-modal-text',
				notCheck.requestMsg
			);
			return false;
		}

		// 비밀번호와 비밀번호 확인 동일한지 체크
		const passCheck = passwordValidCheck(); // 유효하지 않을 경우 에러 메시지 반환
		if (passCheck) {
			showModalWithContent('registerDupModal', 'add-modal-text', passCheck);
			return false;
		}

		return true;
	}

	addEventListeners() {
		const fieldsToCheck = [
			{
				field: 'username',
				validCheck: idValidCheck,
				errorMsg:
					'아이디 형식이 맞지 않습니다.<br />4~12자의 영문 소문자, 숫자와<br />특수기호(_),(-)만 사용 가능합니다.',
				dupMsg: '중복된 아이디입니다.<br />다시 입력해주세요.',
				requestMsg: '아이디 중복확인을 해주세요.'
			},
			{
				field: 'email',
				validCheck: emailValidCheck,
				errorMsg: '이메일 형식이 맞지 않습니다.<br />다시 입력해주세요.',
				dupMsg: '중복된 이메일입니다.<br />다시 입력해주세요.',
				requestMsg: '이메일 중복확인을 해주세요.'
			},
			{
				field: 'nickname',
				validCheck: nicknameValidCheck,
				errorMsg:
					'닉네임 형식이 맞지 않습니다.<br />2~12자의 영문 소문자, 숫자와<br />특수기호(_),(-)만 사용 가능합니다.',
				dupMsg: '중복된 닉네임입니다.<br />다시 입력해주세요.',
				requestMsg: '닉네임 중복확인을 해주세요.'
			}
		];

		// 각 요소의 중복확인 버튼 클릭 시 실행할 event 등록
		fieldsToCheck.forEach(({ field, validCheck, errorMsg, dupMsg }) => {
			this.setupDuplicateCheck(field, validCheck, errorMsg, dupMsg);
		});

		// -----------------------------------------------------------------------
		// 회원가입 버튼 클릭 시
		const confirmForm = document.getElementById('resgister-confirm-form');
		const confirm = document.querySelector('.register-confirm');
		confirm.addEventListener('click', (e) => {
			e.preventDefault();

			const formData = new FormData(confirmForm);
			if (!this.areAllFieldsValid(formData, fieldsToCheck)) {
				return;
			}

			// 모든 검사를 통과한 경우, 회원가입 API 호출 및 중복 확인 상태 초기화
			registerAPI(formData, () =>
				this.duplicateChecker.resetDuplicateCheckStatus()
			);
		});

		// 뒤로 가기 버튼 이벤트 리스너
		const back = document.querySelector('.button-back-in-window');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new RegisterPage();

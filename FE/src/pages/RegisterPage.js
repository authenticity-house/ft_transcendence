import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import TextInputBox from '../components/TextInputBox.js';
import ButtonMedium from '../components/ButtonMedium.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';
import { formDataToJson } from '../utils/formDataToJson.js';

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
			name: 'password'
		});
		const textInputBoxPasswordCheck = new TextInputBox({
			text: '비밀번호 확인',
			button: false,
			name: 'password_confirm'
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
					<form id="resgister-confirm-form">
						<div class="vertical-button-container height-66">
							<div class="bold-title-no-padding gap-1-6">
								${textInputBoxId.template()} ${textInputBoxPassword.template()}
								${textInputBoxPasswordCheck.template()}
								${textInputBoxEmail.template()}
								${textInputBoxNickname.template()}
							</div>
							<div class="register-confirm">${confirmButton.template()}</div>
						</div>
					</form>
				</div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		const confirmForm = document.getElementById('resgister-confirm-form');
		confirmForm.addEventListener('submit', (e) => {
			e.preventDefault();

			const payload = formDataToJson(new FormData(confirmForm));
			console.log(payload);

			//	fetch('http://127.0.0.1:8080/api/users/login/', {
			//		method: 'POST',
			//		headers: {
			//			'Content-Type': 'application/json'
			//		},
			//		body: payload
			//	})
			//		.then((res) => {
			//			// 200 : OK
			//			if (res.ok) {
			//				if (res.status === 204) {
			//					// 204 : No Content - json() 호출 불가
			//					console.log('login success');
			//					changeUrl('onlineMainScreen');

			//					return null;
			//				}
			//				return res.json();
			//			}
			//			throw new Error('Error');
			//		})
			//		.then((data) => console.log(data))
			//		.catch((error) => console.error('Error:', error));
		});

		const back = document.querySelector('.button-back-in-window');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new RegisterPage();

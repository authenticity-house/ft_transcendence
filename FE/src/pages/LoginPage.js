import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import TextInputBox from '../components/TextInputBox.js';
import ButtonMedium from '../components/ButtonMedium.js';
import ButtonSmall from '../components/ButtonSmall.js';
import { formDataToJson } from '../utils/formDataToJson.js';

const html = String.raw;

class LoginPage {
	template() {
		const titleComponent = new BoldTitle('로그인', 'yellow');
		const textInputBoxId = new TextInputBox({
			text: '아이디',
			button: false,
			name: 'username'
		});
		const textInputBoxPassword = new TextInputBox({
			text: '비밀번호',
			button: false,
			name: 'password'
		});
		const loginButton = new ButtonMedium({ text: '로그인', type: 'submit' });
		const login42 = new ButtonSmall('42 로그인');
		const loginGuest = new ButtonSmall('게스트 로그인');

		return html`
			<div class="small-window head_white_neon_15">

			<div class="bold-title-no-padding gap-6">

				${titleComponent.register()}

				<div class="vertical-button-container height-64">
					<div class="bold-title-no-padding gap-4">
						<form id="login-form">
							<div class="bold-title-no-padding gap-6">
								<div class="bold-title-no-padding gap-1-6">
									${textInputBoxId.template()} ${textInputBoxPassword.template()}
								</div>
								<div class="login-button">
									${loginButton.template()}
								</div>

							</div>
						</form>
						<div>
							<span class="login-signup-link display-light20">회원가입</span>
						</div>
					</div>

					<div class="bold-title-no-padding gap-5">
						<div class="login-42">
							${login42.template()}
						</div>

						<div class="login-guest">${loginGuest.template()}</div>
					</div>

				</div>
			</div>
		</div>
		</div>
		`;
	}

	addEventListeners() {
		const loginForm = document.getElementById('login-form');
		loginForm.addEventListener('submit', (e) => {
			e.preventDefault();

			const payload = formDataToJson(new FormData(loginForm));

			fetch('http://127.0.0.1:8080/api/users/login/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: payload
			})
				.then((res) => {
					// 200 : OK
					if (res.ok) {
						if (res.status === 204) {
							// 204 : No Content - json() 호출 불가
							console.log('login success');
							changeUrl('onlineMainScreen');

							return null;
						}
						return res.json();
					}
					throw new Error('Error');
				})
				.then((data) => console.log(data))
				.catch((error) => console.error('Error:', error));
		});

		const signupLink = document.querySelector('.login-signup-link');
		signupLink.addEventListener('click', () => {
			changeUrl('register');
		});

		const login42 = document.querySelector('.login-42');
		login42.addEventListener('click', () => {
			console.log('login42');
		});

		const loginGuest = document.querySelector('.login-guest');
		loginGuest.addEventListener('click', () => {
			changeUrl('play');
		});
	}
}

export default new LoginPage();

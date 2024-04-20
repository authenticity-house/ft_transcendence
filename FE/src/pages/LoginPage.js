import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import TextInputBox from '../components/TextInputBox.js';
import ButtonMedium from '../components/ButtonMedium.js';
import ButtonSmall from '../components/ButtonSmall.js';
import { formDataToJson } from '../utils/formDataToJson.js';
import apiEndpoints from '../constants/apiConfig.js';
import { CLIENT_ID, REDIRECT_URI } from '../constants/constants.js';

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
							<div class="bold-title-no-padding gap-5">
								<div class="bold-title-no-padding gap-1-6">
									${textInputBoxId.template()} ${textInputBoxPassword.template()}
									<div class="text-container"><p class="text-light-left-pink" id="error-message"></p></div>
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

			const formData = new FormData(loginForm);
			const username = formData.get('username');
			const password = formData.get('password');
			const errorMessageElement = document.getElementById('error-message');

			errorMessageElement.textContent = '';

			if (!username && !password) {
				errorMessageElement.textContent = '아이디, 비밀번호를 입력해주세요.';
			} else if (!username) {
				errorMessageElement.textContent = '아이디를 입력해주세요.';
			} else if (!password) {
				errorMessageElement.textContent = '비밀번호를 입력해주세요.';
			} else {
				// 모든 필드가 채워져 있을 경우, 서버로 요청을 보냅니다.
				const payload = formDataToJson(formData);
				fetch(apiEndpoints.LOGIN_URL, {
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
						// if (res.status === 400) {
						// 400 : Bad request, 이메일 인증 안 받음
						console.log('로그인 실패');
						console.log(res);
						// }
						throw new Error('Error');
					})
					.then((data) => console.log(data))
					.catch((error) => {
						console.error('Error:', error);
						errorMessageElement.textContent =
							' 아이디 또는 비밀번호를 잘못 입력했습니다.';
					});
			}
		});

		// 기존의 회원가입 링크와 기타 버튼 이벤트 리스너는 유지
		const signupLink = document.querySelector('.login-signup-link');
		signupLink.addEventListener('click', () => {
			changeUrl('register');
		});

		const login42 = document.querySelector('.login-42');
		login42.addEventListener('click', () => {
			// window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-bd4e13d8c5985218248a27937e7f99476cb6818a2417eb1aa3e9bcc1de456674&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fusers%2Foauth%2F&response_type=code`;
			window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
		});

		const loginGuest = document.querySelector('.login-guest');
		loginGuest.addEventListener('click', () => {
			changeUrl('play');
		});
	}
}

export default new LoginPage();

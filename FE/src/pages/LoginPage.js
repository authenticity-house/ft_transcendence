import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import TextInputBox from '../components/TextInputBox.js';
import ButtonMedium from '../components/ButtonMedium.js';
import ButtonSmall from '../components/ButtonSmall.js';

const html = String.raw;

class LoginPage {
	template() {
		const titleComponent = new BoldTitle('로그인', 'yellow');
		const textInputBoxId = new TextInputBox({ text: '아이디', button: false });
		const textInputBoxPassword = new TextInputBox({
			text: '비밀번호',
			button: false
		});
		const loginButton = new ButtonMedium('로그인');
		const login42 = new ButtonSmall('42 로그인');
		const loginGuest = new ButtonSmall('게스트 로그인');

		return html`
			<div class="small-window head_white_neon_15">
				${titleComponent.template()}

				<div style="margin-bottom: 4rem">
					${textInputBoxId.template()} ${textInputBoxPassword.template()}
				</div>

				<div class="login-button" style="margin-bottom: 2rem">
					${loginButton.template()}
				</div>

				<div class="login-signup">
					<span class="login-signup-link display-light20">회원가입</span>
				</div>

				<div class="login-42" style="margin-bottom: 2rem">
					${login42.template()}
				</div>

				<div class="login-guest">${loginGuest.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		const loginButton = document.querySelector('.login-button');
		loginButton.addEventListener('click', () => {
			console.log('login42');
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

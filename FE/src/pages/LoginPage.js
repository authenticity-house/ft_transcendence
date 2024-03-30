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
			<div class="small-window head_white_neon_15" style="padding: 5rem">

			<div class="bold-title-no-padding" style="gap:4rem">

				${titleComponent.register()}

				<div class="vertical-button-container" style="height:62rem">
					<div class="bold-title-no-padding" style="gap: 2rem">
						<div class="bold-title-no-padding" style="gap: 5rem">
							<div class="bold-title-no-padding" style="gap:1.6rem">
								${textInputBoxId.template()} ${textInputBoxPassword.template()}
							</div>

							<div class="login-button">
								${loginButton.template()}
							</div>
						</div>
						<div>
							<span class="login-signup-link display-light20">회원가입</span>
						</div>
					</div>

					<div class="bold-title-no-padding" style="gap:2rem">
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

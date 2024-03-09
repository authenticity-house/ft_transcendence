import { changeUrl } from '../index.js';

const html = String.raw;

class LoginPage {
	template() {
		return html`
			<div class="login-container head_white_neon_15">
				<div class="login-title">
					<span class="login-title-text display-medium48 yellow_neon_10"
						>로그인</span
					>
				</div>
				<div class="login-input-container">
					<div class="login-input-title display-medium20">아이디</div>
					<input type="text" class="login-input" />
				</div>
				<div class="login-input-container">
					<div class="login-input-title display-medium20">비밀번호</div>
					<input type="password" class="login-input" />
				</div>
				<button class="login-button head_blue_neon_15 blue_neon_10">
					로그인
				</button>
				<div class="login-signup">
					<span class="login-signup-link display-light20">회원가입</span>
				</div>
				<button class="login-42 head_blue_neon_15 blue_neon_10">
					42 로그인
				</button>
				<button class="login-guest head_blue_neon_15 blue_neon_10">
					게스트 로그인
				</button>
			</div>
		`;
	}

	addEventListeners() {
		const loginButton = document.querySelector('.login-button');
		loginButton.addEventListener('click', () => {
			console.log('로그인');
		});

		const signupLink = document.querySelector('.login-signup-link');
		signupLink.addEventListener('click', () => {
			console.log('회원가입');
		});

		const login42 = document.querySelector('.login-42');
		login42.addEventListener('click', () => {
			console.log('42 로그인');
		});

		const loginGuest = document.querySelector('.login-guest');
		loginGuest.addEventListener('click', () => {
			changeUrl('guest');
		});
	}
}

export default new LoginPage();

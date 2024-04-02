import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import TextInputBox from '../components/TextInputBox.js';
import ButtonMedium from '../components/ButtonMedium.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class RegisterPage {
	template() {
		const titleComponent = new BoldTitle('회원가입', 'yellow');
		const textInputBoxId = new TextInputBox({ text: '아이디', button: true });
		const textInputBoxPassword = new TextInputBox({
			text: '비밀번호',
			button: false
		});
		const textInputBoxPasswordCheck = new TextInputBox({
			text: '비밀번호 확인',
			button: false
		});
		const textInputBoxEmail = new TextInputBox({
			text: '이메일',
			button: true
		});

		const textInputBoxNickname = new TextInputBox({
			text: '닉네임',
			button: true
		});

		const nextButton = new ButtonMedium('확인');
		const backButton = new ButtonBackArrow();

		return html`
			<div class="small-window head_white_neon_15">
				<div class="bold-title-no-padding gap-5">
					${titleComponent.register()}
					<div class="vertical-button-container height-66">
						<div class="bold-title-no-padding gap-1-6">
							${textInputBoxId.template()} ${textInputBoxPassword.template()}
							${textInputBoxPasswordCheck.template()}
							${textInputBoxEmail.template()} ${textInputBoxNickname.template()}
						</div>
						<div class="register-next">${nextButton.template()}</div>
					</div>
				</div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		const next = document.querySelector('.register-next');
		next.addEventListener('click', () => {
			changeUrl('');
		});
		const back = document.querySelector('.button-back-in-window');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new RegisterPage();

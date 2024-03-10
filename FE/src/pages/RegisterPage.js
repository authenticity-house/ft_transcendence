import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import TextInputBox from '../components/TextInputBox.js';
import ButtonMedium from '../components/ButtonMedium.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class Register {
	template() {
		const titleComponent = new BoldTitle('회원가입');
		const textInputBoxId = new TextInputBox({ text: '아이디', button: true });
		const textInputBoxPassword = new TextInputBox({
			text: '비밀번호',
			button: false
		});
		const textInputBoxPasswordCheck = new TextInputBox({
			text: '비밀번호 확인',
			button: false
		});
		const nextButton = new ButtonMedium('확인');
		const backButton = new ButtonBackArrow();

		return html`
			<div class="small-window head_white_neon_15">
				${titleComponent.template()} ${textInputBoxId.template()}
				${textInputBoxPassword.template()}
				${textInputBoxPasswordCheck.template()}
				<div class="register-next" style="margin-top: 12rem">
					${nextButton.template()}
				</div>

				<div
					class="back-arrow-container"
					style="display: flex; justify-content: flex-start; 
					align-items: flex-end; width: 100%; height: 100%;"
				>
					${backButton.template()}
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const next = document.querySelector('.register-next');
		next.addEventListener('click', () => {
			changeUrl('registerNickname');
		});
		const back = document.querySelector('.back-arrow-container');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new Register();

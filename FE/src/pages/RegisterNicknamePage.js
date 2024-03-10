import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import TextInputBox from '../components/TextInputBox.js';
import ButtonMedium from '../components/ButtonMedium.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class RegisterNicknamePage {
	template() {
		const titleComponent = new BoldTitle('회원가입');
		const textInputBoxNickname = new TextInputBox({
			text: '닉네임',
			button: true
		});
		const nextButton = new ButtonMedium('확인');
		const backButton = new ButtonBackArrow();

		return html`
			<div class="small-window head_white_neon_15">
				${titleComponent.template()} ${textInputBoxNickname.template()}
				<div class="register-next" style="margin-top: 35rem">
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
			changeUrl('');
		});
		const back = document.querySelector('.back-arrow-container');
		back.addEventListener('click', () => {
			changeUrl('register');
		});
	}
}

export default new RegisterNicknamePage();

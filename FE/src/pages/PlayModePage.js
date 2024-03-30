import { changeUrl } from '../index.js';
import ButtonLarge from '../components/ButtonLarge.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class PlayModePage {
	template() {
		const localButton = new ButtonLarge('LOCAL', false);
		// 나중에 로그인 작업 후, 변경해야 할 것 -> Guest Login 시, true로 / 42Login 또는 일반Login 시 false로 설정하기
		const onlineButton = new ButtonLarge('ONLINE', false);
		const backButton = new ButtonBackArrow();

		return html`
			<div class="select-container ">
				<div class="select-wrapper button-click-local">
					${localButton.template()}
				</div>
				<div class="select-wrapper button-click-online">
					${onlineButton.template()}
				</div>

				<div class="back-arrow-container">
					<div class="back-arrow">${backButton.template()}</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const local = document.querySelector('.button-click-local');
		local.addEventListener('click', () => {
			changeUrl('match');
		});
		const online = document.querySelector('.button-click-online');
		online.addEventListener('click', () => {
			changeUrl('onlineMainScreen');
		});
		const back = document.querySelector('.back-arrow');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new PlayModePage();

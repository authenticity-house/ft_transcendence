import { changeUrl } from '../index.js';
import ButtonLarge from '../components/ButtonLarge.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class PlayModePage {
	template() {
		const localButton = new ButtonLarge('LOCAL', false);
		const onlineButton = new ButtonLarge('ONLINE', true);
		const backButton = new ButtonBackArrow();

		return html`
			<div class="select-container ">
				<div class="select-wrapper button-click-local">
					${localButton.template()}
				</div>
				<div class="select-wrapper button-click-online">
					${onlineButton.template()}
				</div>
				<div class="back-arrow-container">${backButton.template()}</div>
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
			console.log('online button click!');
		});
		const back = document.querySelector('.back-arrow-container');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new PlayModePage();

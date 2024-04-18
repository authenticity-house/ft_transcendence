import { changeUrl } from '../index.js';
import ButtonLarge from '../components/ButtonLarge.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';
import apiEndpoints from '../constants/apiConfig.js';

const html = String.raw;

class PlayModePage {
	template() {
		const localButton = new ButtonLarge('LOCAL');
		const onlineButton = new ButtonLarge('ONLINE');
		const backButton = new ButtonBackArrow();

		return html`
			<div class="select-container">
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

	mount() {
		fetch(apiEndpoints.LOGIN_CHECK_URL, { method: 'GET' })
			.then((res) => {
				if (res.status === 403) {
					const onlineButton = document
						.querySelector('.button-click-online')
						.querySelector('.button-large');
					onlineButton.classList.add('disabled');
				} else if (res.status === 200) {
					const backButton = document.querySelector('.button-back-arrow-box');
					backButton.classList.add('button-display-none');
				}
			})
			.catch((error) => {
				console.error('Error fetching login status:', error);
			});
	}

	addEventListeners() {
		const local = document
			.querySelector('.button-click-local')
			.querySelector('.button-large');
		local.addEventListener('click', () => {
			changeUrl('match');
		});
		const online = document
			.querySelector('.button-click-online')
			.querySelector('.button-large');
		online.addEventListener('click', () => {
			if (online.classList.contains('disabled'))
				console.log('ONLINE Button Clicked! Not LoggedIn');
			else changeUrl('onlineMainScreen');
		});
		const back = document.querySelector('.back-arrow');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new PlayModePage();

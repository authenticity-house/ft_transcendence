import { changeUrl } from '../index.js';

const html = String.raw;

class Test {
	template() {
		return html`<div>
			<button id="home">홈으로 돌아가기</button>
		</div>`;
	}

	addEventListeners() {
		const home = document.getElementById('home');
		home.addEventListener('click', () => {
			console.log('here');
			changeUrl('');
		});
	}
}

export default new Test();

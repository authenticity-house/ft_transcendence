import { changeUrl } from '../index.js';
import ButtonLarge from '../components/ButtonLarge.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class MatchModePage {
	template() {
		const duelButton = new ButtonLarge('1 vs 1', false);
		const tournamentButton = new ButtonLarge('토너먼트', true);
		const backButton = new ButtonBackArrow();

		return html`
			<div class="select-container">
				<div class="select-wrapper button-click-duel">
					${duelButton.template()}
				</div>
				<div class="select-wrapper button-click-tournament">
					${tournamentButton.template()}
				</div>
				<div class="back-arrow-container">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		const game = document.querySelector('.button-click-duel');
		game.addEventListener('click', () => {
			changeUrl('game');
		});
		const tournament = document.querySelector('.button-click-tournament');
		tournament.addEventListener('click', () => {
			console.log('tournament button click!');
		});
		const back = document.querySelector('.back-arrow-container');
		back.addEventListener('click', () => {
			changeUrl('play');
		});
	}
}

export default new MatchModePage();

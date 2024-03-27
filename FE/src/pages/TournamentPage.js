import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import {
	bracketTemplate,
	addUserBracket,
	addWireBracket,
	getUserPosition
} from '../components/TournamentBracket.js';

const html = String.raw;

class TournamentPage {
	template(data) {
		this.data = data;
		const titlComponent = new BoldTitle('대진표', 'yellow');
		const nextButton = new ButtonSmall('다음');
		const bracketInfo = this.data.bracket;
		const openBracket = bracketTemplate(bracketInfo[0]);

		return html`
			<div class="medium-window head_white_neon_15">
				${titlComponent.template()}
				<div class="medium-window-container display-light18">
					${openBracket}
				</div>
				<div class="event-click-match" style="margin-top: 4rem">
					${nextButton.template()}
				</div>
			</div>
		`;
	}

	mount(data) {
		this.data = data;
		const bracketInfo = this.data.bracket;
		const winPlayer = this.data.winner;
		const { position, halfHeight } = getUserPosition();
		const tournamentBracket = document.querySelector('.tournament-bracket');
		const tournamentBracketChild = tournamentBracket.children;
		let depth = 0;
		for (const child of tournamentBracketChild) {
			if (depth === 0) {
				depth += 1;
				continue;
			}
			if (child.classList.contains('user-container')) {
				addUserBracket(
					position,
					halfHeight,
					child,
					bracketInfo[depth],
					winPlayer
				);
				depth += 1;
			} else if (child.classList.contains('wire-container')) {
				addWireBracket(position, child, depth);
			}
		}
	}

	addEventListeners() {
		const next = document.querySelector('.event-click-match');
		next.addEventListener('click', () => {
			this.data.sendMsg();
		});
	}
}

export default new TournamentPage();

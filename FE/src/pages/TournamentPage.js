import { changeUrl } from '../index.js';
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
	template() {
		const titlComponent = new BoldTitle('대진표', 'yellow');
		const nextButton = new ButtonSmall('다음');

		/* <MOCK DATA> bracketInfo = data.depth */
		const bracketInfo = [
			[
				'wonyang',
				'jeongmin',
				'joyoo',
				'jihylim',
				'player5',
				'player6',
				'player7'
			],
			['wonyang', 'PONG !', '', ''],
			['', ''],
			['']
		];
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

	addEventListeners() {
		const next = document.querySelector('.event-click-match');
		next.addEventListener('click', () => {
			changeUrl('');
		});
	}

	mount() {
		/* <MOCK DATA> bracketInfo = data.depth (data.depth[0] 빼고 다 활용) */
		// data.depth[1], data.dept[2]
		const bracketInfo = [
			[
				'wonyang',
				'jeongmin',
				'joyoo',
				'jihylim',
				'player5',
				'player6',
				'player7'
			],
			['wonyang', 'PONG !', '', ''],
			['', ''],
			['']
		];
		const winPlayer = 'wonyang';
		/* */
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
					depth,
					bracketInfo,
					winPlayer
				);
				depth += 1;
			} else if (child.classList.contains('wire-container')) {
				addWireBracket(position, child, depth);
			}
		}
	}
}

export default new TournamentPage();

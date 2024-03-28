import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import {
	bracketTemplate,
	addUserBracket,
	addWireBracket,
	getUserPosition,
	replaceTitle
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
				const userNickName = child.getElementsByTagName('p');
				for (let i = 0; i < userNickName.length; i += 1) {
					if (userNickName[i].innerText === winPlayer) {
						userNickName[i].classList.add('win-player-animation');
					}
				}
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

		// tournament ending
		const textElementAll = document.getElementsByTagName('p');
		const lastBracketText = textElementAll[textElementAll.length - 1].innerText;
		if (!(lastBracketText === '' || lastBracketText === 'PONG !')) {
			// title change
			replaceTitle('.bold-title', winPlayer);
			// pong animation winPlayer
			for (let i = 0; i < textElementAll.length; i += 1) {
				if (textElementAll[i].innerText === winPlayer) {
					textElementAll[i].parentNode.classList.add('pong-animation');
				}
			}
		}
	}

	addEventListeners() {
		const next = document.querySelector('.event-click-match');
		next.addEventListener('click', () => {
			if (this.data.gameOver === true) {
				this.data.Gamewebsocket.sendGameOver();
			} else {
				this.data.Gamewebsocket.sendGameMatchInitSetting();
			}
		});
	}
}

export default new TournamentPage();

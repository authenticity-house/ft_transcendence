import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import { duelReportWrapper } from '../components/DuelReport.js';

const html = String.raw;

class TournamentResultPage {
	template(data) {
		this.data = data;
		const titlComponent = new BoldTitle('게임 결과', 'yellow');
		const exitButton = new ButtonSmall('나가기');
		let duelReports = '';
		/* MOCK DATA */
		const mockData = [0, 1, 2, 3, 4];
		for (let i = 0; i < data.length; i += 1) {
			duelReports += duelReportWrapper(mockData[i]);
		}

		return html`
			<div class="medium-window head_white_neon_15">
				${titlComponent.template()}
				<div class="duel-report-container display-light18">${duelReports}</div>
				<div class="exit-button" style="margin-top: 4rem">
					${exitButton.template()}
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const exit = document.querySelector('.exit-button');
		exit.addEventListener('click', () => {
			this.data.Gamewebsocket.sendGameDisconnect();
			changeUrl('match');
		});
	}
}
export default new TournamentResultPage();

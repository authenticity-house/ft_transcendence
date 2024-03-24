import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import { duelReportWrapper } from '../components/DuelReport.js';

const html = String.raw;

class TournamentResultPage {
	template() {
		const titlComponent = new BoldTitle('게임 결과', 'yellow');
		const exitButton = new ButtonSmall('나가기');
		let duelReports = '';
		/* MOCK DATA */
		const data = [0, 1, 2, 3, 4];
		for (let i = 0; i < data.length; i += 1) {
			duelReports += duelReportWrapper(data[i]);
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
			changeUrl('');
		});
	}
}
export default new TournamentResultPage();

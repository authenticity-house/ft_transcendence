import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import { duelReportWrapper } from '../components/DuelReport.js';
import DuelStatsData from '../components/DuelStatsData.js';
import DuelBasicStats from '../components/DuelBasicStats.js';
import DuelSpecialStats from '../components/DuelSpecialStats.js';
import DuelGraphStats from '../components/DuelGraphStats.js';

const html = String.raw;

class TournamentResultPage {
	template(data) {
		this.data = data;

		const titlComponent = new BoldTitle('게임 결과', 'yellow');
		const exitButton = new ButtonSmall('나가기');
		let duelReports = '';
		// console.log('한 묶음 데이터!');
		for (let i = 0; i < data.length; i += 1) {
			const resultData = DuelStatsData.getDuelStatsData(data[i]);
			const matchRallyHtml = DuelBasicStats.getMatchRallyHTML(resultData);
			const specialStatsHtml = DuelSpecialStats.getSpecialStatsHTML(resultData);
			const scoreTrendHtml = DuelGraphStats.getScoreTrendHTML(resultData);
			const scorePositionHtml = DuelGraphStats.getScorePositionHTML(resultData);

			duelReports += duelReportWrapper(
				resultData,
				matchRallyHtml,
				specialStatsHtml,
				scoreTrendHtml,
				scorePositionHtml
			);
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

	mount(data) {
		let i = 0;
		const graphContainers = document.querySelectorAll('.graph-container');
		graphContainers.forEach((graphContainer) => {
			const matchData = DuelStatsData.getMountDuelStatsData(data[i]);
			// score-trend
			DuelGraphStats.appendScoresToYAxis(matchData.maxScore, graphContainer);
			DuelGraphStats.appendScoreTrendGraph(
				matchData.leftScoreTrend,
				matchData.rightScoreTrend,
				graphContainer
			);
			// score-position
			DuelGraphStats.appendScorePositionGraph(
				matchData.leftPosition,
				matchData.rightPosition,
				graphContainer
			);
			i += 1;
		});

		const toggleConatiners = document.querySelectorAll(
			'.duel-toggle-container'
		);
		toggleConatiners.forEach((toggleContainer) => {
			toggleContainer.classList.toggle('duel-toggle-hidden');
		});
	}

	addEventListeners() {
		const toggleButtons = document.querySelectorAll('.duel-toggle-button');
		toggleButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const parentWrapper = button.closest('.duel-report-wrapper');
				const toggleContent = parentWrapper.querySelector(
					'.duel-toggle-container'
				);
				toggleContent.classList.toggle('duel-toggle-hidden');

				button.querySelector('img').classList.toggle('duel-button-roate');
			});
		});

		const exit = document.querySelector('.exit-button');
		exit.addEventListener('click', () => {
			this.data.Gamewebsocket.sendGameDisconnect();
			changeUrl('match');
		});
	}
}
export default new TournamentResultPage();

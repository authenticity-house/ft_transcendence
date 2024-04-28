import { changeUrl } from '../../index.js';
import BoldTitle from '../../components/BoldTitle.js';
import ButtonSmall from '../../components/ButtonSmall.js';
import { duelReportWrapper } from '../../components/DuelReport.js';
import DuelStatsData from '../../components/DuelStatsData.js';
import DuelBasicStats from '../../components/DuelBasicStats.js';
import DuelSpecialStats from '../../components/DuelSpecialStats.js';
import DuelGraphStats from '../../components/DuelGraphStats.js';

const html = String.raw;

class TournamentResultPage {
	template(data) {
		this.data = data;
		const { content } = this.data;

		console.log(content);

		const titlComponent = new BoldTitle('게임 결과', 'yellow');
		const exitButton = new ButtonSmall('나가기');
		let duelReports = '';

		for (let i = 0; i < content.length; i += 1) {
			const resultData = DuelStatsData.getDuelStatsData(content[i]);
			const matchRallyHtml = DuelBasicStats.getMatchRallyHTML(resultData);
			const specialStatsHtml = DuelSpecialStats.getSpecialStatsHTML(resultData);
			const scoreTrendHtml = DuelGraphStats.getScoreTrendHTML(resultData, true);
			const scorePositionHtml = DuelGraphStats.getScorePositionHTML(
				resultData,
				true
			);

			duelReports += duelReportWrapper(
				resultData,
				matchRallyHtml,
				specialStatsHtml,
				scoreTrendHtml,
				scorePositionHtml,
				true
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
		this.data = data;
		const { content } = this.data;
		let i = 0;

		const duelReportContainer = document.querySelector(
			'.duel-report-container'
		);

		const graphContainers = duelReportContainer.querySelectorAll(
			'.unique-graph-container'
		);
		graphContainers.forEach((graphContainer) => {
			const matchData = DuelStatsData.getMountDuelStatsData(content[i]);
			// score-trend
			DuelGraphStats.appendScoresToYAxis(
				matchData.maxScore,
				graphContainer,
				true
			);
			DuelGraphStats.appendScoreTrendGraph(
				matchData.leftScoreTrend,
				matchData.rightScoreTrend,
				graphContainer,
				true
			);
			// score-position
			DuelGraphStats.appendScorePositionGraph(
				matchData.leftPosition,
				matchData.rightPosition,
				graphContainer,
				true
			);
			i += 1;
		});

		const toggleContainers = duelReportContainer.querySelectorAll(
			'.duel-toggle-container'
		);
		toggleContainers.forEach((toggleContainer) => {
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
			this.data.sendMsg();
			// local
			changeUrl('matchMode');
			// online
			// changeUrl('playMode');
		});
	}
}
export default new TournamentResultPage();

import DuelBasicStats from '../../DuelBasicStats.js';
import DuelGraphStats from '../../DuelGraphStats.js';
import { duelReportWrapper } from '../../DuelReport.js';
import DuelSpecialStats from '../../DuelSpecialStats.js';
import DuelStatsData from '../../DuelStatsData.js';

const html = String.raw;

class MyRecordContent {
	template() {
		return html`
			<div class="my-record-content-container">
				<span class="yellow_neon_10 display-medium48">경기 기록</span>
				<div class="my-record-container"></div>
			</div>
		`;
	}

	mount(data) {
		this.data = data;
		const content = data;

		let duelReports = '';

		for (let i = 0; i < content.length; i += 1) {
			const playerData = {
				player1: content[i].player1,
				player2: content[i].player2
			};
			const resultData = DuelStatsData.getDuelStatsData(content[i].data);
			const matchRallyHtml = DuelBasicStats.getMatchRallyHTML(resultData);
			const specialStatsHtml = DuelSpecialStats.getSpecialStatsHTML(resultData);
			const scoreTrendHtml = DuelGraphStats.getScoreTrendHTML(resultData);
			const scorePositionHtml = DuelGraphStats.getScorePositionHTML(resultData);

			duelReports += duelReportWrapper(
				playerData,
				resultData,
				matchRallyHtml,
				specialStatsHtml,
				scoreTrendHtml,
				scorePositionHtml
			);
		}

		const myRecordContainer = document.querySelector('.my-record-container');
		myRecordContainer.innerHTML = duelReports;

		let i = 0;

		const graphContainers =
			myRecordContainer.querySelectorAll('.graph-container');

		graphContainers.forEach((container) => {
			const matchData = DuelStatsData.getMountDuelStatsData(content[i].data);

			DuelGraphStats.appendScoresToYAxis(matchData.maxScore, container);
			DuelGraphStats.appendScoreTrendGraph(
				matchData.leftScoreTrend,
				matchData.rightScoreTrend,
				container
			);

			DuelGraphStats.appendScorePositionGraph(
				matchData.leftPosition,
				matchData.rightPosition,
				container
			);
			i += 1;
		});

		const toggleContainers = myRecordContainer.querySelectorAll(
			'.duel-toggle-container'
		);
		toggleContainers.forEach((container) => {
			container.classList.add('duel-toggle-hidden');
		});
	}

	addEventListeners() {
		const myRecordContainer = document.querySelector('.my-record-container');
		const toggleButtons = myRecordContainer.querySelectorAll(
			'.duel-toggle-button'
		);
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
	}
}

export const myRecordContent = new MyRecordContent();
